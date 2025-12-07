import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { Role, RoleService } from '../../services/role.service';
import { Company, CompanyService } from '../../services/company.service';
import { NotificationService } from '../../services/notification.service';
import { RosterService } from '../../services/register-roster-service';
import { AttachRoleToEmployee } from '../../components/attach-role-to-employee/attach-role-to-employee';


interface GroupedRoles {
  companyName: string;
  roles: Role[];
  expanded: boolean;
}

@Component({
  selector: 'app-role',
  imports: [CommonModule, AddCompanyModalComponent, AttachRoleToEmployee],
  templateUrl: './role.html',
  styleUrl: './role.scss'
})


export class RoleComponent implements OnInit {
  searchTerm1 = '';
  searchTerm2 = ''; 

  roles: Role[] = [];
  groupedRoles: GroupedRoles[] = [];
  
  showModal = false;
  showModalAttachRole = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  saving = false;

  // Pagination variables
  currentPage = 1;
  pageSize = 10;
  totalItems = 0; 
  totalPages = 0; 

  constructor(
    private roleService: RoleService,
    private rosterService: RosterService,
    private companyService: CompanyService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe(res => {
      this.roles = res;
      this.totalItems = this.roles.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.paginateAndGroupRoles(); 
    });
  }

  searchRoles() {
    const nameTerm = this.searchTerm1.trim();
    const cnpjTerm = this.searchTerm2.trim();

    this.currentPage = 1; 
    
    if (!nameTerm && !cnpjTerm) {
      this.loadRoles();
      return;
    }

    const handleSearchResponse = (res: Role[]) => {
      this.roles = res;
      this.totalItems = this.roles.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.paginateAndGroupRoles(); 
    };
    
    if (nameTerm && cnpjTerm) {
      this.roleService.searchRolesByNameAndCnpj(nameTerm, cnpjTerm)
        .subscribe(handleSearchResponse);
    } else if (cnpjTerm) {
      this.roleService.searchRolesByCnpj(cnpjTerm).subscribe({
          next: handleSearchResponse, 
          error: (err) => this.notificationService.showError("CNPJ not found ")

        })

    } else if (nameTerm) {
        this.roleService.searchRoles(nameTerm).subscribe({
          next: handleSearchResponse,
          error: (err) => this.notificationService.showError("Name not found ")

      })
    }
  }

  addRole(roleName: string, companyName: string) {
    this.saving = true;

    // Find the company by it's name
    this.companyService.getCompanyByName(companyName).subscribe({
      next: (company) => {
        
        const newRole = {name: roleName, companyId: company.id, };
        
        // Create the role
        this.roleService.addRole(newRole).subscribe({
          next: (created) => {

            this.roles = [...this.roles, created]; 
            this.totalItems = this.roles.length;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          
            this.currentPage = this.totalPages > 0 ? this.totalPages : 1; 
            this.paginateAndGroupRoles();

            this.saving = false;
            this.showModal = false;
            this.notificationService.showSuccess("Role created successfully");
          }
        });
      }, error: (err) => {
        this.saving = false;
        this.showModal = false;
        this.notificationService.showError("Error finding company: " + err.message);
      } 
    });
  }

  private paginateAndGroupRoles() {
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    const rolesForCurrentPage = this.roles.slice(startIndex, endIndex); 
    
    const map = new Map<string, Role[]>();
    rolesForCurrentPage.forEach(r => {
        const name = r.company?.name || 'N/A'; 
        if (!map.has(name)) map.set(name, []);
        map.get(name)!.push(r);

    });

    this.groupedRoles = Array.from(map.entries()).map(([companyName, roles]) => ({
        companyName,
        roles,
        expanded: false
    }));
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateAndGroupRoles();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
        this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  openModal() {
    this.showModal = true;
  }

  openModal2() {
    this.showModalAttachRole = true;
  }
}