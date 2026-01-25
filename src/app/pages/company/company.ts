import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { CompanyService, Company, Sector } from '../../services/company.service';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { UpdateCompanyModalComponent } from '../../components/update-company-modal/update-company-modal';
import { DeleteCompanyModalComponent } from '../../components/delete-company-modal/delete-company-modal';
import { AddSectorModalComponent} from '../../components/add-sector-modal/add-sector-modal'
import { NotificationService } from '../../services/notification.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-company',
  templateUrl: './company.html',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule,MatInputModule, CommonModule, AddCompanyModalComponent, AddSectorModalComponent, UpdateCompanyModalComponent, DeleteCompanyModalComponent],
  styleUrls: ['./company.scss'],
})

export class CompanyComponent implements OnInit, AfterViewInit {
  companies: Company[] = [];
  searchTerm: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  saving = false;
  modalType: 'company' | 'sector' = 'company';

  showAddCompanyModal = false;
  showUpdateCompanyModal = false;
  showDeleteCompanyModal = false;
  showAddSectorModal = false;
  
  modalTitle = '';
  secondLabel = '';
  secondPlaceholder = '';
  secondKey = '';
  selectedCompany!: Company;
  
  filterValues = {id:'', name:''};

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Company>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('input') inputs!:QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private companyService: CompanyService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.loadCompanies();

    this.dataSource.filterPredicate = function(data, filter: string)  {
      const parsedFilter = JSON.parse(filter);

      const onId = !parsedFilter.id || data.id?.toString().includes(parsedFilter.id)
      const onName = !parsedFilter.name || data.name?.toLowerCase().trim().includes(parsedFilter.name)

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

    this.loadCompanies();
  }

  filterById(event: Event) {
    this.filterValues.id = (event.target as HTMLInputElement).value.trim()
    this.applyFilter()
  }

  filterByCompanyName(event: Event) {
    this.filterValues.name = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.applyFilter()
  }

  filterByCnpj(event: Event) {
    const cnpj = (event.target as HTMLInputElement).value.trim();

    if (!cnpj) {
      this.loadCompanies()
      return;
    }

    this.companyService.getCompanyByCNPJ(cnpj).subscribe({
      next: (companies) => {
        const company = companies[0]
        this.dataSource.data = company ? [company] : [];
      },
      error: ()=> {
        this.dataSource.data = [];
      }
    })
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe(data => {
      this.companies = data;
      this.dataSource.data = data
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
        
        this.companies = data;
        console.log("Search results:", data);
        }, 

      error: (err) => {
          this.notificationService.showError(err.message);
        }
      });
    }

  openAddCompanyModal(type: 'company') {
    this.modalType = type;
    this.showAddCompanyModal = true;

    this.modalTitle = 'Add Company';
    this.secondLabel = 'CNPJ';
    this.secondPlaceholder = '12345678910111';
    this.secondKey = 'cnpj';
  }
  
  openUpdateCompanyModal(type: 'company', company: Company) {
    this.modalType = type;
    this.showUpdateCompanyModal = true;
    this.selectedCompany = company
  }
  
  openDeleteCompanyModal(type: 'company', company: Company) {
    this.modalType = type;
    this.showDeleteCompanyModal = true;
    this.selectedCompany = company
  }

  openAddSectorModal(type: 'sector') {
    this.modalType = type;
    this.showAddSectorModal = true;

    this.modalTitle = 'Add Sector';
    this.secondLabel = 'Company Name';
    this.secondPlaceholder = 'Company name';
    this.secondKey = 'companyName';
  }

  handleAddCompany(event: any) {
    this.saving = true;

    if (this.modalType === 'company') {
      this.addCompany(event.name, event.cnpj);
      return;
    }
  }

  handleUpdateCompany(event: any) {
    this.updateCompany(this.selectedCompany.id, event.name, event.cnpj);
    return
  }
  
  handleDeleteCompany(event: any) {
    this.deleteCompany(this.selectedCompany.id);
    return
  }

  handleAddSector(event: any) {
    this.companyService.getCompanyByCNPJ(event.cnpj).subscribe({
      next: (companies) => {

        const company = companies[0];
        const newSector: Sector = {
          name: event.name,
          companyId: company.id
        };

        this.companyService.addCompanySector(newSector).subscribe({
          next: () => {
            this.notificationService.showSuccess("Sector created successfully.");
            this.saving = false;
            this.showAddSectorModal = false;
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
    const newCompany = {name: name, cnpj: cnpj}
    this.saving = true;

    this.companyService.addCompany(newCompany).subscribe({
      next: (created) => {
        this.companies = [...this.companies, created];
        this.saving = false;
        this.showAddCompanyModal = false;
        this.loadCompanies();
        this.notificationService.showSuccess("Company created successfully");
      },

      error: (err) => {
        this.notificationService.showError("Error while creating Company");
        this.saving = false;
        this.showAddCompanyModal = false;
        this.loadCompanies();
      }
    });
  }

  updateCompany(id:number, name:string, cnpj:string) {
    const companyPutRequest = { id:id, name:name, cnpj:cnpj };

    this.companyService.updateCompany(companyPutRequest).subscribe({
      next: () => {
        this.loadCompanies()
        this.showUpdateCompanyModal = false;
        this.notificationService.showSuccess("Company updated successfully");
      },
      error: () => {
        this.notificationService.showError("Error while updating Company");
        this.showUpdateCompanyModal = false;
      }
    });
  }

  deleteCompany(id: number) {
    this.companyService.deleteCompany(id).subscribe({
      next: () => {
        this.loadCompanies()
        this.showDeleteCompanyModal = false;
        this.notificationService.showSuccess("Company deleted successfully");
      },
      error: () => {
        this.notificationService.showError("Error while deleting Company");
        this.showDeleteCompanyModal = false;
      }
    });
  }
}