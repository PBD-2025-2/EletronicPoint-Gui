import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Roster } from '../../services/register-roster-service';
import { AddEmployeeModal } from '../../components/add-employee-modal/add-employee-modal';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, AddEmployeeModal],
  templateUrl: './employee.html',
  styleUrl: './employee.scss'
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  searchTerm: string = '';
  showAddEmployeeModal = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  saving = false;

  modalTitle = '';
  secondLabel = '';
  secondPlaceholder = '';
  secondKey = '';

  rosters: Roster[] = [];

  groups: {
    expanded: boolean;
    employee: {
      employeeName: string;
    };
    records: {
      rosterName: string;
      rosterType: string;
      rosterHours: string;
      sectorName: string;
      roleName: string;
      companyName: string;
    }[];
  }[] = [];



  constructor(
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
            // always create the employee
            this.groups.push({
              expanded: false,
              employee: { employeeName: emp.name },
              records: roles.map(item => ({
                rosterName: item.roster?.name ?? 'Sem escala',
                rosterType: item.roster?.type ?? '',
                rosterHours: item.roster?.weeklyWorkload ?? '',
                sectorName: item.role.sectors.name,
                roleName: item.role.name,
                companyName: item.role.sectors.company.name
              }))
            });
          },
          error: (err) => {
            this.groups.push({
              expanded: false,
              employee: { employeeName: emp.name },
              records: []
            })
          }
        }
        );
      });
    },
    );
  }

  openAddEmployeeModal() {
    this.showAddEmployeeModal = true;
    this.modalTitle = 'Add Employee';
    this.secondLabel = 'CPF';
    this.secondPlaceholder = '12345678901';
    this.secondKey = 'cpf';
  }

  handleSaveEmployee(event: any) {
    console.log("handleSaveEmployee called with:", event);
    this.saving = true;

    this.addEmployee(event.name, event.cpf);
    return;
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

  searchEmployees() {
    const term = this.searchTerm?.trim();
    if (!term) {
      this.loadEmployees();
      return;
    }

    this.employeeService.searchEmployees(term).subscribe({
      next: (data) => {
    
        let employeeList: string[] = [];
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          employeeList.push(data.name);

        } else {
          data.forEach( (emp: Employee) => {
            employeeList.push(emp.name);
          });
        }

        this.groups = [];

        // if the name is not empty
        employeeList.forEach(employeeName => { this.employeeService.getEmployeeRolesByName(employeeName).subscribe({
          next: roles => {
            this.groups.push({
              expanded: false,
              employee: { employeeName: employeeName },
              records: roles.map(item => ({
                rosterName: item.roster?.name ?? 'Sem escala',
                rosterType: item.roster?.type ?? '',
                rosterHours: item.roster?.weeklyWorkload ?? '',
                sectorName: item.role.sectors.name,
                roleName: item.role.name,
                companyName: item.role.sectors.company.name
              }))
            });
          },
          error: (err) => {
            this.groups.push({
              expanded: false,
              employee: { employeeName },
              records: []
            });
          }
        }
        )
        this.currentPage = 1;
      });
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
}
