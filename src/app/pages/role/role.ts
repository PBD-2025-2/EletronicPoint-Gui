import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { Role, RoleService } from '../../services/role.service';
import { Company, CompanyService } from '../../services/company.service';
import { NotificationComponent } from '../../components/notification/notification';

interface GroupedRoles {
  companyName: string;
  roles: Role[];
  expanded: boolean;
}


@Component({
  selector: 'app-role',
  imports: [CommonModule, AddCompanyModalComponent, NotificationComponent],
  templateUrl: './role.html',
  styleUrl: './role.scss'
})


export class RoleComponent implements OnInit {
  searchTerm1 = '';
  searchTerm2 = ''; 
  roles: Role[] = [];
  groupedRoles: any[] = [];
  showModal = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;


  constructor(
    private roleService: RoleService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe(res => {
      this.roles = res;
      this.groupRoles();
    });
  }

  searchRoles() {
    const nameTerm = this.searchTerm1.trim();
    const cnpjTerm = this.searchTerm2.trim();

    // If the field is empty, load the all roles
    if (!nameTerm && !cnpjTerm) {
      this.loadRoles();
      return;
    }

    if (nameTerm && cnpjTerm) {

      // Try to find by the role name and the company's CNPJ
      this.roleService.searchRolesByNameAndCnpj(nameTerm, cnpjTerm)
        .subscribe(res => {
          this.roles = res;
          this.groupRoles();
        });

    } else if (cnpjTerm) {
    
      // Try to find by only the CNPJ
      this.roleService.searchRolesByCnpj(cnpjTerm).subscribe({
          next: (res) => {
            this.roles = res;
            this.groupRoles();
          },
          error: (res) => {
            this.showNotification("Company's CNPJ not found", false);
          }
        })

    } else if (nameTerm) {
        this.roleService.searchRoles(nameTerm).subscribe({
          next: (res) => {
            this.roles = res;
            this.groupRoles();
          },
          error: (res) => {
            this.showNotification("Role not found", false);
          }

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
            this.groupRoles();
            this.saving = false;
            this.showModal = false;
            this.showNotification("Role created successfully", true);
          },
          error: (err) => {
            this.showNotification("Erro ao carregar roles do servidor.", false);
            this.saving = false;
          }

        });
      },
      error: () => {
        this.showNotification("Error while creating Role! Company not found.", false);
        this.saving = false;
        this.showModal = false;
      }

    });
  }

   private groupRoles() {
    const map = new Map<string, Role[]>();
    this.roles.forEach(r => {
      const name = r.company.name;
      if (!map.has(name)) map.set(name, []);
      map.get(name)!.push(r);
    });

    this.groupedRoles = Array.from(map.entries()).map(([companyName, roles]) => ({
      companyName,
      roles,
      expanded: false
    }));
  }

  openModal() {
    this.showModal = true;
    console.log(this.showModal)
  }

  saving = false;

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

}
