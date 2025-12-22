import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../../services/employee.service';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Roster } from '../../services/register-roster-service';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, AddCompanyModalComponent],
  templateUrl: './employee.html',
  styleUrl: './employee.scss'
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  searchTerm: string = '';
  showModal = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

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

  searchEmployees() {
    const term = this.searchTerm?.trim();
    if (!term) {
      this.loadEmployees();
      return;
    }

    this.employeeService.searchEmployees(term).subscribe({
      next: (data) => {

        let employeeName = null;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          employeeName = data.name;
        } else {
          employeeName = data[0].name;
        }

        this.groups = [];

        // if the name is not empty
        const employeeRoles = this.employeeService.getEmployeeRolesByName(employeeName).subscribe({
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
      },
      error: (err) => {
        this.notificationService.showError("Employee not found!");
      }
    })
  }

  
  private showNotification(message: string, typeNotification: boolean) {
    if (typeNotification) {
      this.successMessage = message;
      setTimeout(() => this.successMessage = null, 3000);
    } else {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = null, 3000);
    }
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

  openModal() {
    this.showModal = true;
  }
}
