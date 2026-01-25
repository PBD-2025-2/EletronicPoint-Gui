import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Role, RoleService } from '../../services/role.service';
import { RosterService } from '../../services/roster.service';
import { EmployeeService } from '../../services/employee.service';
import { CompanyService } from '../../services/company.service';
import { NotificationService } from '../../services/notification.service';
import { AttachRoleToEmployee } from '../../components/attach-role-to-employee/attach-role-to-employee';
import { AddRoleModalComponent } from '../../components/add-role-modal/add-role-modal';
import { map, of, switchMap, tap, throwError } from 'rxjs';
import { UpdateRoleModalComponent } from '../../components/update-role-modal/update-role-modal';
import { DeleteRoleModalComponent } from '../../components/delete-role-modal/delete-role-modal';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-role',
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, CommonModule, AddRoleModalComponent, AttachRoleToEmployee, UpdateRoleModalComponent, DeleteRoleModalComponent],
  templateUrl: './role.html',
  styleUrl: './role.scss'
})

export class RoleComponent implements OnInit {

  roles: Role[] = [];

  showAddRoleModal = false;
  showUpdateRoleModal = false;
  showDeleteRoleModal = false;
  showAttachRoleToEmployeeModal = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  saving = false;

  selectedRole!: Role;

  filterValues = {id:'', name:'', sector:'', company:''};

  displayedColumns: string[] = ['id', 'name', 'sector', 'company', 'actions'];
  dataSource = new MatTableDataSource<Role>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('input') inputs!:QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private roleService: RoleService,
    private companyService: CompanyService,
    private rosterService: RosterService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.loadRoles();

    this.dataSource.filterPredicate = function(data, filter: string)  {
      const parsedFilter = JSON.parse(filter);

      const onId = !parsedFilter.id || data.id?.toString().includes(parsedFilter.id);
      const onName = !parsedFilter.name || data.name?.toLowerCase().trim().includes(parsedFilter.name);
      const onSector = !parsedFilter.sector || data.sectors.name?.toLowerCase().trim().includes(parsedFilter.sector);
      const onCompany = !parsedFilter.company || data.sectors.company.name?.toLowerCase().trim().includes(parsedFilter.company);

      return onId && onName && onSector && onCompany;
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

    this.filterValues = {id: '', name: '', sector:'', company:'' };
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.loadRoles();
  }

  filterById(event: Event) {
    this.filterValues.id = (event.target as HTMLInputElement).value.trim()
    this.applyFilter()
  }

  filterByRoleName(event: Event) {
    this.filterValues.name = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.applyFilter()
  }

  filterBySectorName(event: Event) {
    this.filterValues.sector = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.applyFilter()
  }

  filterByCompanyName(event: Event) {
    this.filterValues.company = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.applyFilter()
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: data => {
        this.roles = data;
        this.dataSource.data = data
      },
      error: err => {
        this.notificationService.showError("Error while loading roles");
      }
    });
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
    const cnpj = event.cnpj?.trim();
    const sectorName = event.sectorName?.trim();

    if (!roleName || !cnpj || !sectorName) {
      return this.notificationService.showError('Preencha todos os campos!');
    }

    return this.addRole(roleName, cnpj, sectorName);
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

  handleAttachRoleToEmployee(event: any) {
    console.log("event: ", event)
    if (!event) {
      return this.notificationService.showError('Evento vazio');
    };

    const rosterName = event.rosterName?.trim();
    const roleName = event.roleName?.trim();
    const employeeCPF = event.employeeCPF?.trim();
    const companyCNPJ = event.companyCNPJ?.trim();
    const status = event.status?.trim();

    console.log("rosterName: ", rosterName)
    console.log("roleName: ", roleName)
    console.log("employeeCPF: ", employeeCPF)
    console.log("companyCNPJ: ", companyCNPJ)
    console.log("status: ", status)

    if (!rosterName || !roleName || !employeeCPF || !companyCNPJ || !status) {
      return this.notificationService.showError('Preencha todos os campos!');
    }

    return this.attachRoleToEmployee(rosterName, roleName, employeeCPF, companyCNPJ, status);
  }

  addRole(roleName: string, cnpj: string, sectorName: string) {
    console.log("Adding Role:", roleName, "CompanyCNPJ:", cnpj, "Sector:", sectorName)
    this.saving = true;

    this.getCompanyByCNPJ(cnpj).pipe(
      map(companies => {
        return companies[0];
      }),

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

  attachRoleToEmployee(rosterName: string, roleName: string, employeeCPF: string,  companyCNPJ:string, status:string) {
    this.rosterService.getRosterByName(rosterName).subscribe({
      next: (roster) => {
        const idRoster = roster[0].id;

        this.employeeService.getEmployeeByCpf(employeeCPF).subscribe({
          next: (emp) => {
            const employeeId = emp[0].id;

            this.getCompanyByCNPJ(companyCNPJ).subscribe({
              next: (companies) => {
                const companId = companies[0].id

                this.roleService.searchRolesByNameAndCompanyId(roleName, companId).subscribe({
                  next: (roles) => {
                    const roleId = roles[0].id;
                    const attachData = {
                      status: this.parseStatusStrngtoStatusBoolean(status),
                      idRoster,
                      employeeId,
                      roleId,
                    };

                    this.roleService.attachRoleToEmployee(attachData).subscribe({
                      next: () => {
                        this.notificationService.showSuccess("Role attached successfully");
                        this.saving = false;
                        this.showAttachRoleToEmployeeModal = false;
                      },
                      error: (err) => {
                        this.saving = false;
                        this.notificationService.showError(err.message);
                      }
                    });
                  },
                  error: (err) => this.notificationService.showError(err.message)
                });
                    

              }
            })
          },
          error: () => {
            this.saving = false;
            this.notificationService.showError("Employee not found");
          }
        });
      },
      error: () => {
        this.saving = false;
        this.notificationService.showError("Roster not found");
      }
    });
  }

  private createRole(roleName: string, sectorId: number) {
    return this.roleService.createRole(roleName, sectorId);
  }

  private getCompanyByCNPJ(cnpj: string) {
    return this.companyService.getCompanyByCNPJ(cnpj);
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

  private parseStatusStrngtoStatusBoolean(status:string) {
    if (status == 'Ativo') {
      return true;
    }

    return false;
  }
}
