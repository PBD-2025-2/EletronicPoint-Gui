import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeRoles, EmployeeRolesPutRequest, EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Roster, RosterService } from '../../services/register-roster-service';
import { AddEmployeeModal } from '../../components/add-employee-modal/add-employee-modal';
import { UpdateEmployeeModalComponent } from '../../components/update-employee-modal/update-employee-modal';
import { DeleteEmployeeModalComponent } from '../../components/delete-employee-modal/delete-employee-modal';
import { UpdateEmployeeRolesModalComponent } from '../../components/update-employeeRoles-modal/update-employeeRoles-modal';
import { map, switchMap } from 'rxjs';
import { RoleService } from '../../services/role.service';

interface EmployeesFieldExtractor {
  rosterName: string,
  roleName: string,
  status: string
}

@Component({
  selector: 'app-employee',
  imports: [CommonModule, AddEmployeeModal, UpdateEmployeeModalComponent, DeleteEmployeeModalComponent, UpdateEmployeeRolesModalComponent],
  templateUrl: './employee.html',
  styleUrl: './employee.scss'
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  searchTerm: string = '';
  showAddEmployeeModal = false;
  showUpdateEmployeeModal = false;
  showDeleteEmployeeModal = false;
  showUpdateEmployeeRolesModal = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  saving = false;

  modalTitle = '';
  secondLabel = '';
  secondPlaceholder = '';
  secondKey = '';

  selectedEmployee!: Employee;
  selectedEmployeeRoles!: EmployeeRoles;

  rosters: Roster[] = [];

  groups: {
    expanded: boolean;
    employee: Employee;
    employeeRoles: EmployeeRoles[];
  }[] = [];

  constructor(
    private roleService: RoleService,
    private rosterService: RosterService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) { }

  currentPage: number = 1;
  itemsPerPage: number = 10;


  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
  this.groups = [];

  this.employeeService.getAllEmployees().subscribe(employees => {
    employees.forEach(emp => {
      this.employeeService.getEmployeeRolesByName(emp.name).subscribe({
        next: roles => {
          this.groups.push({
            expanded: false,
            employee: { id: emp.id, name: emp.name },
            employeeRoles: roles
          });
        },
        error: () => {
          this.groups.push({
            expanded: false,
            employee: { id: emp.id, name: emp.name },
            employeeRoles: []
          });
        }
      });
    });
  });
}

  openAddEmployeeModal() {
    this.showAddEmployeeModal = true;
    this.modalTitle = 'Add Employee';
    this.secondLabel = 'CPF';
    this.secondPlaceholder = '12345678901';
    this.secondKey = 'cpf';
  }
  
  openUpdateEmployeeModal(employee: Employee) {
    this.showUpdateEmployeeModal = true;
    this.selectedEmployee = employee;
  }
  
  openDeleteEmployeeModal(employee: Employee) {
    this.showDeleteEmployeeModal = true;
    this.selectedEmployee = employee;
  }

  openUpdateEmployeeRolesModal(employeeRoles : EmployeeRoles) {
    this.showUpdateEmployeeRolesModal = true;
    this.selectedEmployeeRoles = employeeRoles;
  }

  handleSaveEmployee(event: any) {
    return this.addEmployee(event.name, event.cpf);
  }

  handleUpdateEmployee(event: any) {
    console.log("Event:", event);
    console.log("Employee:", this.selectedEmployee);
    return this.updateEmployee(this.selectedEmployee.id, event.name, event.cpf)
  }
  
  handleDeleteEmployee(event: any) {
    console.log("Event:", event);
    console.log("Employee:", this.selectedEmployee);
    return this.deleteEmployee(this.selectedEmployee.id)
  }

  handleUpdateEmployeeRoles(event: any) {
    const employeeRolesFieldExtractor: EmployeesFieldExtractor = { rosterName: event.rosterName, roleName: event.roleName, status: event.status }
    return this.updateEmployeeRoles(employeeRolesFieldExtractor)
  }

  addEmployee(name: string, cpf: string) {
    const newEmployee = {name: name, cpf: cpf};
    this.saving = true;

    this.employeeService.addEmployee(newEmployee).subscribe({
      next: (created) => {
        this.employees = [...this.employees, created];
        this.currentPage = this.totalPages;
        this.saving = false;
        this.showAddEmployeeModal = false;
        this.notificationService.showSuccess("Employee created successfully");
        this.loadEmployees();
      },

      error: (err) => {
        this.notificationService.showError("Error while creating Employee");
        this.saving = false;
        this.showAddEmployeeModal = false;
      }
    });
  }

  updateEmployee(id:number, name:string, cpf:string) {
    const employeePutRequest = { id:id, name:name, cpf:cpf };

    this.employeeService.updateEmployee(employeePutRequest).subscribe({
      next: () => {
        this.loadEmployees()
        this.showUpdateEmployeeModal = false;
        console.log("EmployeeUpdated: ", employeePutRequest)
        this.notificationService.showSuccess("Employee updated successfully");
      },
      error: () => {
        this.notificationService.showError("Error while updating employee");
        this.showUpdateEmployeeModal = false;
      }
    });
  }
  
  deleteEmployee(id:number) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees()
        this.showDeleteEmployeeModal = false;
        this.notificationService.showSuccess("Employee deleted successfully");
      },
      error: () => {
        this.notificationService.showError("Error while deleting employee");
        this.showDeleteEmployeeModal = false;
      }
    });
  }

  updateEmployeeRoles(employeeRolesFieldExtractor: EmployeesFieldExtractor) {
    console.log("employeeRolesFieldExtractor: ", employeeRolesFieldExtractor)
    this.rosterService.searchRosterByName(employeeRolesFieldExtractor.rosterName).pipe(
      switchMap(rosters => {
        return this.roleService.searchRolesByNameAndCompanyId(employeeRolesFieldExtractor.roleName, this.selectedEmployeeRoles.role.sectors.company.id).pipe(
          switchMap(roles => {
            const role = roles[0];
            const roster = rosters[0]
            const status = this.convertStatusToBoolean(employeeRolesFieldExtractor.status)
            
            console.log("role: ", role)
            console.log("roster: ", roster)
            console.log("status: ", status)

            const employeeRolesPutRequest = {
              id: this.selectedEmployeeRoles.id,
              status: status,
              idRoster: roster.id, 
              employeeId:this.selectedEmployeeRoles.employee.id, 
              roleId: role.id, 
            }

            console.log("employeeRolesPutRequest: ", employeeRolesPutRequest)
            return this.employeeService.updateEmployeeRoles(employeeRolesPutRequest)
          })
        )
      })
    ).subscribe({
        next: () => {
          this.loadEmployees()
          this.showUpdateEmployeeRolesModal = false;
          this.notificationService.showSuccess("Employee Roles Details updated successfully");
        },
        error: (err) => {
          console.log("ERROR: ", err)
          this.notificationService.showError("Error while updating Employee Roles Details");
          this.showUpdateEmployeeRolesModal = false;
        }
      });
  }

  searchEmployees() {
    const term = this.searchTerm?.trim();
    if (!term) {
      this.loadEmployees();
      return;
    }

    this.employeeService.searchEmployees(term).subscribe({
      next: (data) => {

        let name = null;
        let id = null;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          id = data.id
          name = data.name;
        } else {
          name = data[0].name;
        }

        this.groups = [];

        // if the name is not empty
        const employeeRoles = this.employeeService.getEmployeeRolesByName(name).subscribe({
          next: roles => {
            this.groups.push({
              expanded: false,
              employee: { id:id, name: name },
              employeeRoles: roles
            });
          },
          error: (err) => {
            this.groups.push({
              expanded: false,
              employee: { id, name },
              employeeRoles: []
            });
          }
        }
        )
        this.currentPage = 1;
      },
      error: (err) => {
        this.notificationService.showError(err.message || "Employee not found!");
      }
    })
  }

  get paginatedRoles(): Employee[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.employees.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.employees.length / this.itemsPerPage);
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private convertStatusToBoolean(status: string): boolean {
    return status === 'Ativo';
  }

}
