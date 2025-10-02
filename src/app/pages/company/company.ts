import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService, Company } from '../../services/company.service';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { NotificationComponent } from '../../components/notification/notification';


@Component({
  selector: 'app-company',
  templateUrl: './company.html',
  standalone: true,
  imports: [CommonModule, AddCompanyModalComponent, NotificationComponent],
  styleUrls: ['./company.scss'],
})
export class CompanyComponent implements OnInit {
  companies: Company[] = [];
  searchTerm: string = '';
  showModal = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private companyService: CompanyService,
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
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe(data => {
      this.companies = data;
    });
  }

  searchCompanies() {
    const term = this.searchTerm?.trim();
    if (!term) {
      this.loadCompanies();
      return;
    }
    
    this.companyService.searchCompanies(term).subscribe({
      next: (data) => {
        console.log("Received data from the Backend", data);
        this.companies = data;
      },
      error: (err) => {
        console.log("HAHSHAHSHS")
        this.showNotification("Error while doing search! Company not found", false);
      }
    });
  }

  openModal() {
    this.showModal = true;
    console.log(this.showModal)
  }

  saving = false;

  addCompany(name: string, cnpj: string) {
    const newCompany = { name: name, cnpj: cnpj}
    this.saving = true;

    this.companyService.addCompany(newCompany).subscribe({
      
      next: (created) => {
        this.showNotification("Company created sucessfully", true);
        this.companies = [...this.companies, created];
        this.saving = false;
        this.showModal = false;
      }, 
      error: (err) => {
        this.showNotification("Error while creating Company", false);
        this.saving = false;
        this.showModal = false;
      }
    });
  }
}
