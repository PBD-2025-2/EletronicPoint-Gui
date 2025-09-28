import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddCompanyModalComponent } from '../../components/add-company-modal/add-company-modal';
import { Role, RoleService } from '../../services/role.service';
import { Company, CompanyService } from '../../services/company.service';

interface GroupedRoles {
  companyName: string;
  roles: Role[];
  expanded: boolean;
}


@Component({
  selector: 'app-role',
  imports: [CommonModule, AddCompanyModalComponent],
  templateUrl: './role.html',
  styleUrl: './role.scss'
})


export class RoleComponent implements OnInit {
  searchTerm1 = '';
  searchTerm2 = ''; 
  roles: Role[] = [];
  groupedRoles: any[] = [];
  showModal = false;

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

    if (nameTerm && cnpjTerm) {

      // Try to find by the role name and the company's CNPJ
      this.roleService.searchRolesByNameAndCnpj(nameTerm, cnpjTerm)
        .subscribe(res => {
          this.roles = res;
          this.groupRoles();
        });

    } else if (cnpjTerm) {
    
      // Try to find by only the CNPJ
      this.roleService.searchRolesByCnpj(cnpjTerm)
        .subscribe(res => {
          this.roles = res;
          this.groupRoles();
        });

    } else if (nameTerm) {
      // Try to find by role name or ID
      this.roleService.searchRoles(nameTerm)
        .subscribe(res => {
          this.roles = res;
          this.groupRoles();
        });
    }
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

  addRole(roleName: string, companyName: string) {
    this.saving = true;

    // Find the company by it's name
    this.companyService.getCompanyByName(companyName).subscribe({
      next: (company) => {
        
        const newRole = {name: roleName, companyId: company.id, };
        
        // Create the role
        this.roleService.addRole(newRole).subscribe({
          next: (created) => {
            console.log('Role created successfully', created);
            this.roles = [...this.roles, created];
            this.groupRoles();
            this.saving = false;
            this.showModal = false;
          },
          error: (err) => {
            console.error('Error while creating Role', err);
            this.saving = false;
          }
        });
      },
      error: (err) => {
        console.error('Company not found', err);
        this.saving = false;
      }
    });
  }
}
