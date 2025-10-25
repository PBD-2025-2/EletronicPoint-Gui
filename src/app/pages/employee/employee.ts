import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../../services/employee.service';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

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
  

  constructor (
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) {}

    // Pagination variables
    currentPage: number = 1;
    itemsPerPage: number = 10; 
  
    // Paginated list getter
    get paginatedRoles(): Employee[] {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.employees.slice(start, start + this.itemsPerPage);
    }
  
    // Total pages getter
    get totalPages(): number {
      return Math.ceil(this.employees.length / this.itemsPerPage);
    
    }
  
    // page buttons method 
    getPagesArray(): number[] {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  
    // Change pagination
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }

  private showNotification(message: string, typeNotification: boolean) {
    if (typeNotification) {
      // Sucess notification
      this.successMessage = message;
      setTimeout(() => this.successMessage = null, 3000);

    } else {
      // Error notification
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = null, 3000);
    }
  }
  
  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
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
        this.employees = data;
        this.currentPage = 1; 
      },

      error: (err) => {
        this.notificationService.showError("Error while doing search! Employee not found.");
      }
    });
  }

  openModal() {
    this.showModal = true;
    console.log(this.showModal)
  }

  saving = false;

  addEmployee(name: string, cpf: string) {
    const newEmployee = { name: name, cpf: cpf}
    this.saving = true;

    this.employeeService.addEmployee(newEmployee).subscribe({
      next: (created) => {
        this.employees = [...this.employees, created];
        this.currentPage = this.totalPages; // Move to last page
        this.saving = false;
        this.showModal = false;
        this.notificationService.showSuccess('Employee created successfully!');
      }, 
      
      error: (err) => {
        this.saving = false;
        this.showModal = false;
        this.notificationService.showError('Error while creating Employee');
      }
    });
  }
}
