import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeRoles, EmployeeRoleService, EmployeeRolesPutRequest } from '../../services/employeeRoles.service';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UpdateEmployeeRolesModalComponent } from '../update-employeeRoles-modal/update-employeeRoles-modal';
import { NotificationService } from '../../services/notification.service';
import { DeleteEmployeeRolesModalComponent } from '../delete-employeeRoles-modal/delete-employeeRoles-modal';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employeeRoles-modal',
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatFormFieldModule,MatInputModule,MatSelectModule, UpdateEmployeeRolesModalComponent, DeleteEmployeeRolesModalComponent],
  templateUrl: './employeeRoles-modal.html',
  styleUrl: './employeeRoles-modal.scss',
})

export class EmployeeRolesComponent {
    @Input() modalTitle = 'Employee Roles Details';
    @Input() employeeRoles: EmployeeRoles[] = [];
    @Input() employeeName: string = '';

    @Output() closeModal = new EventEmitter<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChildren('input') inputs!:QueryList<ElementRef<HTMLInputElement>>;

    showUpdateEmployeeRolesModal = false;
    showDeleteEmployeeRolesModal = false;

    selectedEmployeeRoles! :EmployeeRoles;
    selectedRosterType : string = '';
    selectedStatus : string = '';

    filterValues = {id:'', roster:'', role: '', sector: '', company: '', rosterType: '', status: ''};
    
    displayedColumns: string[] = ['id', 'rosterName', 'rosterType', 'weeklyWorkload', 'role', 'sector', 'company', 'status', 'actions'];
    dataSource = new MatTableDataSource<EmployeeRoles>();

    constructor (
      private employeeRolesService : EmployeeRoleService,
      private notificationService: NotificationService
    ) {}

    ngOnInit() {
      this.dataSource.filterPredicate = function(data, filter: string)  {
        const parsedFilter = JSON.parse(filter);

        const onId = !parsedFilter.id || data.id?.toString().includes(parsedFilter.id);
        const onRoster = !parsedFilter.roster || data.roster.name?.toLowerCase().trim().includes(parsedFilter.roster);
        const onRole = !parsedFilter.role || data.role.name?.toLowerCase().trim().includes(parsedFilter.role);
        const onSector = !parsedFilter.sector || data.role.sectors.name?.toLowerCase().trim().includes(parsedFilter.sector);
        const onCompany = !parsedFilter.company || data.role.sectors.company.name?.toLowerCase().trim().includes(parsedFilter.company);
        const onRosterType = !parsedFilter.rosterType || data.roster.type?.toLowerCase().trim().includes(parsedFilter.rosterType);
        const onStatus = !parsedFilter.status || String(data.status) === parsedFilter.status;
        
        return onId && onRoster && onRosterType && onRole && onSector && onCompany && onStatus;
      };
    }

    ngOnChanges() {
      if (this.employeeRoles) {
        this.dataSource.data = this.employeeRoles;
      }
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

      this.filterValues = {id: '', roster: '', role: '', sector: '', company: '', rosterType: '', status: ''};
      this.selectedRosterType = '';
      this.selectedStatus = '';
      this.dataSource.filter = '';

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

      this.reloadTable();
    }

    filterById(event: Event) {
      this.filterValues.id = (event.target as HTMLInputElement).value.trim()
      this.applyFilter()
    }

    filterByRosterName(event: Event) {
      this.filterValues.roster = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
      this.applyFilter()
    }
    
    filterByRoleName(event: Event) {
      this.filterValues.role = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
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
    
    filterByRosterType(event: String) {
      this.filterValues.rosterType = event.toLocaleLowerCase();
      this.applyFilter()
    }
    
    filterByStatus(event: String) {
      this.filterValues.status = event.toLowerCase();
      this.applyFilter()
    }

    reloadTable() {
      this.employeeRolesService.getEmployeeRolesByEmployeeId(this.selectedEmployeeRoles.employee.id).subscribe(data => {
        this.dataSource.data = data;
      })
    }

    openUpdateEmployeeRolesModal(employeeRoles : EmployeeRoles) {
      this.showUpdateEmployeeRolesModal = true;
      this.selectedEmployeeRoles = employeeRoles;
    }
    
    openDeleteEmployeeRolesModal(employeeRoles : EmployeeRoles) {
      this.showDeleteEmployeeRolesModal = true;
      this.selectedEmployeeRoles = employeeRoles;
    }

    handleUpdateEmployeeRoles(event: any) {
      console.log("Event: ", event)
      const employeeRolesPutRequest = {id: this.selectedEmployeeRoles.id, 
                                        employeeId: event.employeeId,
                                        roleId: event.roleId,
                                        idRoster: event.rosterId,
                                        status: this.parseStatusStringToBoolean(event.status)}

      return this.update(employeeRolesPutRequest)
    }
    
    handleDeleteEmployeeRoles(event: any) {
      return this.delete(event.id);
    }

    update(employeeRolesPutRequest : EmployeeRolesPutRequest) {
      console.log("employeeRolesPutRequest: ", employeeRolesPutRequest)

      this.employeeRolesService.updateEmployeeRoles(employeeRolesPutRequest).subscribe({
        next: (updated) => {
          this.showUpdateEmployeeRolesModal = false;
          this.reloadTable();
          this.notificationService.showSuccess("Employee Role updated successfully")
        },
        error: (err) => {
          this.notificationService.showError("Error while updating Employee");
          this.showUpdateEmployeeRolesModal = false;
        }
      })
    }

    delete(employeeRolesId: number) {
      this.employeeRolesService.deleteEmployeeRoles(employeeRolesId).subscribe({
        next: (deleted) => {
          this.showDeleteEmployeeRolesModal = false;
          this.reloadTable();
          this.notificationService.showSuccess("Employee Role deleted successfully")
        },
        error: (err) => {
          this.showDeleteEmployeeRolesModal = false;
          this.notificationService.showError("Error while deleting Employee");
        }
      })
    }
    
    close() {
      this.closeModal.emit();
    }

    parseStatusBooleanToString(status : boolean) {
      if (status) {
        return "Ativo"
      }

      return "Desativado"
    }
    
    private parseStatusStringToBoolean(status : string) {
      if (status === "Ativo") {
        return true
      }

      return false
    }
}
