import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../../services/employee.service';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../components/notification/notification';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, AddCompanyModalComponent, NotificationComponent],
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
  ) {} 

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
      },
      error: (err) => {
        this.showNotification("Error while doing search! Employee not found.", false);
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
        this.saving = false;
        this.showModal = false;
      }, 
      error: (err) => {
        this.showNotification('Error while creating Employee', false);
        this.saving = false;
      }
    });
  }
}
