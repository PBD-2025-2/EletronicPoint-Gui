import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { Role, RoleService } from '../../services/role.service';
import { Company, CompanyService } from '../../services/company.service';
import { AttachRoleEmployeeModal } from '../../components/attach-role-employee-modal/attach-role-employee-modal';
import { AttachRoleEmployeeService } from '../../services/attach-role-employee.service';
import { NotificationService } from '../../services/notification.service';

interface GroupedRoles {
  companyName: string;
  roles: Role[];
  expanded: boolean;
}

@Component({
  selector: 'app-role',
  imports: [CommonModule, AddCompanyModalComponent, AttachRoleEmployeeModal],
  templateUrl: './role.html',
  styleUrl: './role.scss'
})


export class RoleComponent implements OnInit {
  searchTerm1 = '';
  searchTerm2 = ''; 
  roles: Role[] = [];
  groupedRoles: GroupedRoles[] = [];
  showModal = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  isAttachModalOpen = false;
  
  saving = false;

  // Pagination variables
  currentPage = 1;
  pageSize = 10;
  totalItems = 0; 
  totalPages = 0; 


  constructor(
    private roleService: RoleService,
    private companyService: CompanyService,
    private attachRoleEmployeeService: AttachRoleEmployeeService,
    private notificationService: NotificationService
  ) {}


  openAttachModal() {
    this.isAttachModalOpen = true;
  }

  closeAttachModal() {
    this.isAttachModalOpen = false;
  }

  onAttachSave(data: { status: string; workregime: string; employeeName: string; roleName: string }) {
    const statusBoolean = data.status.toLowerCase() === 'true';
    const workregimeInt = parseInt(data.workregime, 10);
    this.attachRoleToEmployee(statusBoolean, workregimeInt, data.employeeName, data.roleName);
    this.isAttachModalOpen = false;
  }

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
          next: handleSearchResponse
        })
    } else if (nameTerm) {
        this.roleService.searchRoles(nameTerm).subscribe({
          next: handleSearchResponse
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
            this.showNotification("Role created successfully", true);
          }
        });
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

  attachRoleToEmployee(status: boolean, workregime: number, employeeName: string, roleName: string) {
    this.attachRoleEmployeeService.getEmployeeByName(employeeName).subscribe({
      next: (employees) => {
        if (!employees || employees.length === 0) {
          return;
        }
        const employee = employees[0];

        this.attachRoleEmployeeService.getRoleByName(roleName).subscribe({
          next: (roles) => {
            if (!roles || roles.length === 0) {
              return;
            }
            
            const role = roles[0];
            console.log('EmployeeID:', employee.id);
            console.log('RoleName:', role.name);
            
            const attachData = {
              status: status,
              workRegime: workregime,
              employeeId: (employee as any).id,
              roleId: (role as any).id
            };
            
            this.attachRoleEmployeeService.attachRoleToEmployee(attachData).subscribe({
              next: () => {
                this.notificationService.showSuccess('Role successfully attached to employee!');
              },
              /*,
              error: (err) => {
                const backendMessage = err?.error?.message || 'Error while attaching role to employee.';
                //this.showNotification('Error while attaching role to employee.', false);
                this.showNotification(backendMessage, false);
              }*/
            });
          }/*,
          error: () => {
            this.showNotification(`Error searching for role "${roleName}".`, false);
          }*/
        });
      }/*,
      error: () => {
        this.showNotification(`Error searching for employee "${employeeName}".`, false);
      }*/

    });
  }
}