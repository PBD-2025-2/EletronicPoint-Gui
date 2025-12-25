import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Role, RoleService } from '../../services/role.service';
import { CompanyService } from '../../services/company.service';
import { NotificationService } from '../../services/notification.service';
import { AttachRoleToEmployee } from '../../components/attach-role-to-employee/attach-role-to-employee';
import { AddRoleModalComponent } from '../../components/add-role-modal/add-role-modal';
import { of, switchMap, tap, throwError } from 'rxjs';
import { UpdateRoleModalComponent } from '../../components/update-role-modal/update-role-modal';
import { DeleteRoleModalComponent } from '../../components/delete-role-modal/delete-role-modal';

interface GroupedRoles {
  companyName: string;
  roles: Role[];
  expanded: boolean;
}

@Component({
  selector: 'app-role',
  imports: [CommonModule, AddRoleModalComponent, AttachRoleToEmployee, UpdateRoleModalComponent, DeleteRoleModalComponent],
  templateUrl: './role.html',
  styleUrl: './role.scss'
})

export class RoleComponent implements OnInit {
  searchTerm1 = '';
  searchTerm2 = '';

  roles: Role[] = [];
  groupedRoles: GroupedRoles[] = [];

  showAddRoleModal = false;
  showUpdateRoleModal = false;
  showDeleteRoleModal = false;
  showAttachRoleToEmployeeModal = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  saving = false;

  selectedRole!: Role;

  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;
console: any;

  constructor(
    private roleService: RoleService,
    private companyService: CompanyService,
    private notificationService: NotificationService,
  ) { }

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
        this.notificationService.showError("Error while loading roles");
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

  openAddRoleModal() {
    this.showAddRoleModal = true;
  }

  openUpdateRoleModal(role: Role) {
    this.showUpdateRoleModal = true;
    this.selectedRole = role;
  }
  
  openDeleteRoleModal(role: Role) {
    console.log(role)
    this.showDeleteRoleModal = true;
    this.selectedRole = role;
  }

  openAttachRoleToEmployeeModal() {
    this.showAttachRoleToEmployeeModal = true;
  }

  handleAddRole(event: any) {
    if (!event) {
      return this.notificationService.showError('Evento vazio');
    };

    const roleName = event.name?.trim();
    const companyName = event.companyName?.trim();
    const sectorName = event.sectorName?.trim();

    if (!roleName || !companyName || !sectorName) {
      return this.notificationService.showError('Preencha todos os campos!');
    }

    return this.addRole(roleName, companyName, sectorName);
  }

  handleUpdateRole(event: any) {
    console.log("EVENT: ", event)
    console.log("Selected Role: ", this.selectedRole)
    if (!event) {
      return this.notificationService.showError('Evento vazio');
    };

    const roleName = event.name?.trim();
    const sectorName = event.sectorName?.trim();

    if (!roleName || !sectorName) {
      return this.notificationService.showError('Preencha todos os campos!');
    }

    return this.updateRole(this.selectedRole, roleName, sectorName)
  }

  handleDeleteRole(event: any) {
    console.log("EVENT: ", event)
    console.log("Selected Role: ", this.selectedRole)
    return this.deleteRole(this.selectedRole.id);
  }

  addRole(roleName: string, companyName: string, sectorName: string) {
    console.log("Adding Role:", roleName, "Company:", companyName, "Sector:", sectorName)
    this.saving = true;

    this.getCompanyByName(companyName).pipe(
      switchMap(company =>
        this.getSectorByNameAndCompany(sectorName, company.id)
      ),

      switchMap(sector =>
        this.createRole(roleName, sector.id)
      )

    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Sector created sucessfully!');
        this.showAddRoleModal = false;
        this.saving = false;
        this.loadRoles();
      },
      error: err => {
        this.saving = false;
        this.notificationService.showError(err.message || 'Error while creating Sector');
      }
    });
  }

  private createRole(roleName: string, sectorId: number) {
    return this.roleService.createRole(roleName, sectorId);
  }

  updateRole(role: Role, name: string, sectorName: string) {
    this.getSectorByNameAndCompany(sectorName, role.sectors.company.id).pipe(
      switchMap(sector => {
        const rolePutRequest = { id: role.id, name: name, sectorId: sector.id };
        return this.roleService.updateRole(rolePutRequest);
      })
    )
      .subscribe({
        next: () => {
          this.loadRoles()
          this.showUpdateRoleModal = false;
          this.notificationService.showSuccess("Role updated successfully");
        },
        error: () => {
          this.notificationService.showError("Error while updating Role");
          this.showAddRoleModal = false;
        }
      });
  }

  deleteRole(id: number) {
    this.roleService.deleteRole(id).subscribe({
      next: () => {
        this.loadRoles()
        this.showDeleteRoleModal = false;
        this.notificationService.showSuccess("Role deleted successfully");
      },
      error: () => {
        this.notificationService.showError("Error while deleting Role");
        this.showDeleteRoleModal = false;
      }
    });
  }

  private getCompanyByName(companyName: string) {
    return this.companyService.getCompanyByName(companyName).pipe(
      tap(company => console.log('COMPANY FOUND:', company)),
      switchMap(company => {
        if (!company?.id) {
          return throwError(() => new Error('Empresa encontrada, mas sem ID'));
        }
        return of(company);
      })
    );
  }

  private getSectorByNameAndCompany(sectorName: string, companyId: number) {
    console.log("sectorName:", sectorName)
    console.log("companyId:", companyId)
    return this.roleService.getSectorByNameAndCompany(sectorName, companyId).pipe(
      tap(sector => console.log('SECTOR FOUND:', sector)),
      switchMap(sector => {
        if (!sector?.id) {
          return throwError(() => new Error('Setor não encontrado para esta empresa'));
        }
        return of(sector);
      })
    );
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


}
