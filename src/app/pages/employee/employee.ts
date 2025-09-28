import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../../services/employee.service';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { CommonModule } from '@angular/common';

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

  constructor (
    private employeeService: EmployeeService,
  ) {} 

  
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
        console.log("Received data from the Backend", data);
        
        this.employees = data;
      },
      error: (err) => {
        console.error("Error while doing search", err);
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
        console.log('Employee created sucessfully', created);
        this.employees = [...this.employees, created];
        this.saving = false;
        this.showModal = false;
      }, 
      error: (err) => {
        console.error('Error while creating Employee', err);
        this.saving = false;
      }
    });
  }
}
