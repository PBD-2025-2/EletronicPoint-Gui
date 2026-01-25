import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddEmployeeModal } from '../../components/add-employee-modal/add-employee-modal';
import { DeleteEmployeeModalComponent } from '../../components/delete-employee-modal/delete-employee-modal';
import { EmployeeRolesComponent } from '../../components/employeeRoles-modal/employeeRoles-modal';
import { UpdateEmployeeModalComponent } from '../../components/update-employee-modal/update-employee-modal';
import { Employee, EmployeeService } from '../../services/employee.service';
import { EmployeeRoles, EmployeeRoleService } from '../../services/employeeRoles.service';
import { NotificationService } from '../../services/notification.service';
import { Roster } from '../../services/roster.service';

interface EmployeesFieldExtractor {
  rosterName: string,
  roleName: string,
  status: string
}

@Component({
  selector: 'app-employee',
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule,MatInputModule, CommonModule, AddEmployeeModal, UpdateEmployeeModalComponent, DeleteEmployeeModalComponent, EmployeeRolesComponent],
  templateUrl: './employee.html',
  styleUrl: './employee.scss'
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  rosters: Roster[] = [];
  searchTerm: string = '';
  showAddEmployeeModal = false;
  showUpdateEmployeeModal = false;
  showDeleteEmployeeModal = false;
  showViewDetailsEmployessRolesModal = false;
  showUpdateEmployeeRolesModal = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  saving = false;

  modalTitle = '';
  secondLabel = '';
  secondPlaceholder = '';
  secondKey = '';

  selectedEmployee!: Employee;
  selectedEmployeeName: string = '';
  selectedEmployeeRoles!: EmployeeRoles;
  selectedEmployeeRolesList!: EmployeeRoles[];

  filterValues = {id:'', name:''};

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Employee>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('input') inputs!:QueryList<ElementRef<HTMLInputElement>>;

  groups: {
    employee: Employee;
    employeeRoles: EmployeeRoles[];
  }[] = [];

  constructor(
    private employeeService: EmployeeService,
    private employeeRolesService: EmployeeRoleService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadEmployees();

    this.dataSource.filterPredicate = function(data, filter: string)  {
      const parsedFilter = JSON.parse(filter);

      const onId = !parsedFilter.id || data.id?.toString().includes(parsedFilter.id);
      const onName = !parsedFilter.name || data.name?.toLowerCase().trim().includes(parsedFilter.name);

      return onId && onName;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters() {
    this.inputs.forEach(input => input.nativeElement.value = '');

    this.filterValues = {id: '', name: ''};
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.loadEmployees();
  }

  filterById(event: Event) {
    this.filterValues.id = (event.target as HTMLInputElement).value.trim()
    this.applyFilter()
  }

  filterByEmployeeName(event: Event) {
    this.filterValues.name = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.applyFilter()
  }

  filterByCpf(event: Event) {
    const cpf = (event.target as HTMLInputElement).value.trim();

    if (!cpf) {
      this.loadEmployees()
      return;
    }

    this.employeeService.getEmployeeByCpf(cpf).subscribe({
      next: (employees) => {
        const employee = employees[0]
        this.dataSource.data = employee ? [employee] : [];
      },
      error: ()=> {
        this.dataSource.data = [];
      }
    })
  }

  loadEmployees() {
    this.groups = [];

    this.employeeService.getAllEmployees().subscribe(employees => {
      this.dataSource.data = employees;

      employees.forEach(emp => {
        this.employeeRolesService.getEmployeeRolesByName(emp.name).subscribe({
          next: roles => {
            this.groups.push({
              employee: { id: emp.id, name: emp.name },
              employeeRoles: roles
            });
          },
          error: () => {
            this.groups.push({
              employee: { id: emp.id, name: emp.name },
              employeeRoles: []
            });
          }
        });
      });
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

        this.employeeRolesService.getEmployeeRolesByName(name).subscribe({
          next: roles => {
            this.groups.push({
              employee: { id:id, name: name },
              employeeRoles: roles
            });
          },
          error: (err) => {
            this.groups.push({
              employee: { id, name },
              employeeRoles: []
            });
          }
        }
        )
      },
      error: (err) => {
        this.notificationService.showError(err.message || "Employee not found!");
      }
    })
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

  openViewDetailsEmployessRolesModal(employee : Employee) {
    this.selectedEmployeeName = employee.name;
    this.employeeRolesService.getEmployeeRolesByEmployeeId(employee.id).subscribe(employeesRoles => {
      this.selectedEmployeeRolesList = employeesRoles;
      this.showViewDetailsEmployessRolesModal = true;
      }
    )
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

  addEmployee(name: string, cpf: string) {
    const newEmployee = {name: name, cpf: cpf};
    this.saving = true;

    this.employeeService.addEmployee(newEmployee).subscribe({
      next: (created) => {
        this.employees = [...this.employees, created];
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
}
