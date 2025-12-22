import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService, Company, Sector } from '../../services/company.service';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { NotificationService } from '../../services/notification.service';

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
  errorMessage: string | null = null;
  successMessage: string | null = null;
  saving = false; 

  constructor(
    private companyService: CompanyService,
    private notificationService: NotificationService
  ) {}

  modalType: 'company' | 'sector' = 'company';

  modalTitle = '';
  secondLabel = '';
  secondPlaceholder = '';
  secondKey = '';

  currentPage: number = 1;
  itemsPerPage: number = 10; 


  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe(data => {
      this.companies = data;
      this.currentPage = 1
    });
  }

  searchCompanies() {
    const term = this.searchTerm?.trim();
    if (!term) {
      this.loadCompanies();
      return;
    }

    console.log("Searching for companies with term:", term);
    this.companyService.searchCompanies(term).subscribe({
      next: (data) => {
        
        this.companies = data;
        console.log("Search results:", data);
        this.currentPage = 1;
        }, 

      error: (err) => {
          this.notificationService.showError(err.message);
        }
      });
    }

    openModal(type: 'company' | 'sector') {
      console.log("Calling openModal2 with type:", type);
      this.modalType = type;
      this.showModal = true;

      if (type === 'company') {
        this.modalTitle = 'Add Company';
        this.secondLabel = 'CNPJ';
        this.secondPlaceholder = '12345678910111';
        this.secondKey = 'cnpj';
      } else {
        this.modalTitle = 'Add Sector';
        this.secondLabel = 'Company Name';
        this.secondPlaceholder = 'Company name';
        this.secondKey = 'companyName';
      }
    }

    handleSave(event: any) {
      this.saving = true;

      if (this.modalType === 'company') {
        this.addCompany(event.name, event.cnpj);
        return;
      }

      this.companyService.getCompanyByName(event.companyName).subscribe({
        next: (company) => {
          const newSector: Sector = {
            name: event.name,
            companyId: company.id
          };

          this.companyService.addCompanySector(newSector).subscribe({
            next: () => {
              this.notificationService.showSuccess("Sector created successfully.");
              this.saving = false;
              this.showModal = false;
            },
            error: () => {
              this.notificationService.showError("Error while creating sector.");
              this.saving = false;
            }
          });
        },
        error: () => {
          this.notificationService.showError("Company not found.");
          this.saving = false;
        }
      });
    }

    addCompany(name: string, cnpj: string) {
      const newCompany = { name: name, cnpj: cnpj}
      this.saving = true;

      this.companyService.addCompany(newCompany).subscribe({
        next: (created) => {
          this.companies = [...this.companies, created];
          this.currentPage = this.totalPages;
          this.saving = false;
          this.showModal = false;
          this.notificationService.showSuccess("Company created successfully");
        },

        error: (err) => {
          this.notificationService.showError("Error while creating Company");
          this.saving = false;
          this.showModal = false;
        }
      });
    }


  get paginatedCompanies(): Company[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.companies.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.companies.length / this.itemsPerPage);
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