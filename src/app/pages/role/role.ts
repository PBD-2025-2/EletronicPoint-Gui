import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { Role, RoleService } from '../../services/role.service';
import { Company, CompanyService } from '../../services/company.service';
import { NotificationService } from '../../services/notification.service';
import { RosterService } from '../../services/register-roster-service';
import { AttachRoleToEmployee } from '../../components/attach-role-to-employee/attach-role-to-employee';
import { AddRoleModal, AddRoleEvent } from '../../components/add-role-modal/add-role-modal';
import { switchMap, throwError } from 'rxjs';

interface GroupedRoles {
  companyName: string;
  roles: Role[];
  expanded: boolean;
}

@Component({
  selector: 'app-role',
  imports: [CommonModule, AddRoleModal, AttachRoleToEmployee],
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
  pageSize = 9;
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
    this.roleService.getRoles().subscribe({
      next: res => {
        this.roles = res;
        this.totalItems = this.roles.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.paginateAndGroupRoles();
      },
      error: err => {
        console.error("Erro ao carregar roles:", err);
        this.notificationService.showError("Erro ao carregar roles");
      }
    });
  }

  searchRoles() {
    console.log("CALLING SEARCH ROLES");

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
        .subscribe({ next: handleSearchResponse, error: () => this.notificationService.showError("Erro na busca") });
    } else if (cnpjTerm) {
      console.log("SEARCHING BY CNPJ ONLY: ", cnpjTerm);

      
      this.roleService.searchRolesByCnpj(cnpjTerm).subscribe({
        next: handleSearchResponse,
        error: (err) => this.notificationService.showError("CNPJ not found ")
      });

    } else if (nameTerm) {
      this.roleService.searchRoles(nameTerm).subscribe({
        next: handleSearchResponse,
        error: (err) => this.notificationService.showError("Name not found ")
      });
    }
  }

  addRole(event: AddRoleEvent) {
    if (!event) return;

    const roleName = event.name.trim();
    const companyName = event.companyName.trim();
    const sectorName = event.sectorName.trim();

    if (!roleName || !companyName || !sectorName) {
      this.notificationService.showError('Preencha todos os campos');
      return;
    }

    this.saving = true;

    this.companyService.getCompanyByName(companyName).pipe(

      // 1️⃣ pega o companyId
      switchMap(company => {
        console.log("COMPANY FOUND:", company);
        if (!company.id) {
          return throwError(() => new Error('Empresa encontrada, mas sem ID'));
        }

        // 2️⃣ usa o endpoint NOVO (SEM FILTRO)
        return this.roleService.getSectorByNameAndCompany(
          sectorName,
          company.id
        );
      }),

      // 3️⃣ cria o cargo
      switchMap(sector => {
        
        console.log("SECTOR FOUND:", sector);
        if (!sector || !sector.id) {
          return throwError(() => new Error('Sector not found for this company'));
        }

        return this.roleService.createRole({
          name: roleName,
          sectorId: sector.id
        });
      })

    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Sector created sucessfully!');
        this.showModal = false;
        this.saving = false;
        this.loadRoles();
      },
      error: err => {
        console.error('ERROR ADD ROLE:', err);
        this.saving = false;
        this.notificationService.showError(
          err.message || 'Error while creating Sector'
        );
      }
    });
  }



  
  private paginateAndGroupRoles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    const rolesForCurrentPage = this.roles.slice(startIndex, endIndex);

    const map = new Map<string, Role[]>();

    rolesForCurrentPage.forEach(r => {
      const companyName = r.sectors?.company?.name || 'N/A';

      if (!map.has(companyName)) {
        map.set(companyName, []);
      }

      map.get(companyName)!.push(r);
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
