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
      error: (err) => {
        this.notificationService.showError("Error while loading roles");
      }
    });
  }

  searchRoles() {
    const roleName = this.searchTerm1.trim();
    const sectorName = this.searchTerm2.trim();
    this.currentPage = 1;

    if (!roleName && !sectorName) {
      this.loadRoles();
      return;
    }

    if (!roleName && sectorName) {
      this.notificationService.showError("Please provide a role name to search by sector.");
      this.loadRoles();
      return;
    }

    const handleSearchResponse = (res: Role[]) => {
      this.roles = res;
      this.totalItems = this.roles.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.paginateAndGroupRoles();
    };

    if (roleName && !sectorName) {
      this.roleService.searchRoles(roleName).subscribe({
      
        next: (data) => { this.handleSearchRolesByName(data, handleSearchResponse); },

        error: (err) => { this.notificationService.showError(err.message || "Role not found "); }
      });
    
    }
    else if (roleName && sectorName) {
      this.roleService.searchRoles(roleName, sectorName).subscribe({

        next: (data) => { this.handleSearchRolesByNameAndSector(data, handleSearchResponse); },

        error: (err) => { this.notificationService.showError("RoleName or SectorName not found"); }
      });
    }
  }

  handleSearchRolesByName(data: any, doIt: any) {
    
    let roleList: string[] = [];
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      roleList.push(data.name);

    } else {
      data.forEach( (role: Role) => {
        roleList.push(role.name);
      });
    }

    this.groupedRoles = [];

    roleList.forEach(roleName => { this.roleService.getRoleByName(roleName).subscribe({
      next: doIt
    })})
  }

  handleSearchRolesByNameAndSector(data: any, doIt: any) {
    
    let roleList: string[] = [];
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      roleList.push(data.name);

    } else {
      data.forEach( (role: Role) => {
        roleList.push(role.name);
      });
    }

    this.groupedRoles = [];

    roleList.forEach(roleName => { this.roleService.getRoleByName(roleName).subscribe({
      next: doIt
    })})
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
      return this.notificationService.showError("Event empty");
    };

    const roleName = event.name?.trim();
    const companyName = event.companyName?.trim();
    const sectorName = event.sectorName?.trim();

    if (!roleName || !companyName || !sectorName) {
      return this.notificationService.showError("Please provide all the fields!");
    }

    return this.addRole(roleName, companyName, sectorName);
  }

  handleUpdateRole(event: any) {
    if (!event) {
      return this.notificationService.showError("Event empty");
    };

    const roleName = event.name?.trim();
    const sectorName = event.sectorName?.trim();

    if (!roleName || !sectorName) {
      return this.notificationService.showError("Please provide all the fields!");
    }

    return this.updateRole(this.selectedRole, roleName, sectorName)
  }

  handleDeleteRole(event: any) {
    return this.deleteRole(this.selectedRole.id);
  }

  addRole(roleName: string, companyName: string, sectorName: string) {
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
        this.notificationService.showSuccess("Sector created sucessfully!");
        this.showAddRoleModal = false;
        this.saving = false;
        this.loadRoles();
      },
      error: err => {
        this.saving = false;
        this.notificationService.showError(err.message || "Error while creating Sector");
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
      switchMap(company => {
        if (!company?.id) {
          return throwError(() => new Error("Company not found"));
        }
        return of(company);
      })
    );
  }

  private getSectorByNameAndCompany(sectorName: string, companyId: number) {
    return this.roleService.getSectorByNameAndCompany(sectorName, companyId).pipe(
      switchMap(sector => {
        if (!sector?.id) {
          return throwError(() => new Error("Sector not found in this company!"));
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
