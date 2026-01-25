import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeRoles } from '../../services/employeeRoles.service';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { Role, RoleService } from '../../services/role.service';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { Roster, RosterService } from '../../services/roster.service';


@Component({
selector: 'app-update-employeeRoles-modal',
  templateUrl: './update-employeeRoles-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule, AsyncPipe],   
  styleUrls: ['./update-employeeRoles-modal.scss']
})

export class UpdateEmployeeRolesModalComponent {
  @Input() modalTitle = 'Update Employee Roles Details';
  @Input() employeeRoles!: EmployeeRoles;

  @Output() closeModal = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<{rosterId: number, roleId: number, employeeId: number, status: string}>();

  status :string = 'Ativo';

  roles: Role[] = [];
  rosters: Roster[] = [];

  roleControl = new FormControl<string | Role>('');
  rosterControl = new FormControl<string | Roster>('');

  filteredRoles: Observable<Role[]>;
  filteredRosters: Observable<Roster[]>;

  constructor (
    private roleService : RoleService,
    private rosterService : RosterService
  ) {
    this.filteredRoles = this.roleControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), 
      map(value => {
        const search =
          typeof value === 'string' ? value : value?.name ?? '';
        return this._filterRoles(search);
      })
    )

    this.filteredRosters = this.rosterControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), 
      map(value => {
        const search =
          typeof value === 'string' ? value : value?.name ?? '';
        return this._filterRosters(search);
      })
    )
  }

  ngOnInit () {
    this.loadRolesToSearch();
    this.loadRostersToSearch();
  }
  
  displayRole(role: Role): string {
    return role ? role.name : '';
  }
  
  displayRoster(roster: Roster): string {
    return roster ? roster.name : '';
  }

  isFormValid(): boolean {
    if (typeof this.roleControl.value === 'object' && typeof this.rosterControl.value === 'object') {
      return true
    }

    return false;
  }
  
  loadRolesToSearch() {
    if (this.employeeRoles == null) {
      return
    }

    this.getRolesByCompanyId(this.employeeRoles.role.sectors.company.id).subscribe({
      next: (roles) => {
        this.roles = roles;
        this.roleControl.setValue(this.roleControl.value);
      },
      error: err => {
        this.roles = [];
      }
    })
  }
  
  loadRostersToSearch() {
    if (this.employeeRoles == null) {
      return
    }

    this.getRosters().subscribe({
      next: (rosters) => {
        this.rosters = rosters;
        this.rosterControl.setValue(this.rosterControl.value);
      },
      error: err => {
        this.rosters = [];
      }
    })
  }

  getRolesByCompanyId(companyId: number) {
    return this.roleService.searchRolesByCompanyId(companyId);
  }

  getRosters() {
    return this.rosterService.getRosters();
  }

  update() {
    const rosterId = this.extractId(this.rosterControl.value);
    const roleId = this.extractId(this.roleControl.value);

    this.updateItem.emit({
      roleId: roleId,
      rosterId: rosterId,
      employeeId: this.employeeRoles.employee.id,
      status: this.status
    });
  }

  close() {
    this.closeModal.emit();
  }
  
  private _normalizedValue(value : string ) : string {
    return value.toLocaleLowerCase().replace(/\s/g, '');
  }

  private _filterRoles(value: string) : Role[] {
    const filterValue = this._normalizedValue(value);
    return this.roles.filter(role => this._normalizedValue(role.name).includes(filterValue));
  }

  private _filterRosters(value: string) : Roster[] {
    const filterValue = this._normalizedValue(value);
    return this.rosters.filter(roster => this._normalizedValue(roster.name).includes(filterValue));
  }

  private extractId (value: any) : number {
    return value?.id ?? null;
  }

}
