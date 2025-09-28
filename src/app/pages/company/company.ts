import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService, Company } from '../../services/company.service';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';


@Component({
  selector: 'app-company',
  templateUrl: './company.html',
  standalone: true,
  imports: [CommonModule, AddCompanyModalComponent],
  styleUrls: ['./company.scss'],
})
export class CompanyComponent implements OnInit {
  companies: Company[] = [];
  searchTerm: string = '';
  showModal = false;


  constructor(
    private companyService: CompanyService,
  ) {}

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
        console.error("Error while doing search", err);
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
        console.log('Company created sucessfully', created);
        this.companies = [...this.companies, created];
        this.saving = false;
        this.showModal = false;
      }, 
      error: (err) => {
        console.log('Error while creating Company', err);
        this.saving = false;
      }
    });
  }
}
