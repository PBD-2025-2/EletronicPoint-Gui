import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/register-roster-service';
import { EmployeeService } from '../../services/employee.service';
import { RoleService } from '../../services/role.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-attach-role-to-employee',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrl: './attach-role-to-employee.scss',
  templateUrl: './attach-role-to-employee.html',
})

export class AttachRoleToEmployee {
  @Input() title = 'Add Item';
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveItem = new EventEmitter<{ name: string; [key: string]: string }>();

  status = '';
  rosterName = '';
  employeeName = '';
  roleName = '';
 
  saving = false;
  
  constructor(
    private rosterService: RosterService,
    private employeeService: EmployeeService,
    private roleService: RoleService,
    private notificationService: NotificationService,
  ) {}

  closeAttach() {
    this.closeModal.emit();
  }

  saveAttach() {
    this.saving = true;

    let idRoster: number;
    let employeeId: number;
    let roleId: number;
  
    this.rosterService.getRosterByName(this.rosterName).subscribe({
      next: (roster) => {
        idRoster = roster.id;

        // Get Employee ID by name
        this.employeeService.getEmployeeByName(this.employeeName).subscribe({
          next: (emp) => {
            employeeId = emp.id;

            // Get Role ID by name
            this.roleService.searchRoles(this.roleName).subscribe({
              next: (roles) => {
                if (roles.length === 0) {
                  throw new Error('Role not found');
                }

                roleId = roles[0].id;

                const attachData = {
                  status: this.status,
                  idRoster,
                  employeeId,
                  roleId,
                };

                // Now attach the role to the employee
                this.roleService.attachRoleToEmployee(attachData).subscribe({
                  next: () => {
                    this.notificationService.showSuccess("Role attached successfully");
                    this.saving = false;
                    this.closeAttach();
                  },
                  error: (err) => {
                    this.saving = false;
                    this.notificationService.showError(err.message);
                  }
                });
              },
              error: (err) => this.notificationService.showError(err.message)
            });
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
}
