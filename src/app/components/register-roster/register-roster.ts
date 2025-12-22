import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Roster, RosterService } from '../../services/register-roster-service';
import { CreateNewRosterModal } from '../create-new-roster-modal/create-new-roster-modal';
import { RosterMapper } from '../roster.mapper.ts/roster.mapper.ts';

@Component({
  selector: 'app-register-roster',
  standalone: true,
  imports: [CommonModule, CreateNewRosterModal],
  templateUrl: './register-roster.html',
  styleUrl: './register-roster.scss'
})

export class RegisterRoster {
  searchTerm1 = '';
  searchTerm2 = ''; 

  isAttachModalOpen = false;
  rosters: Roster[] = [];

  groupedRosters: {
    rosterName: string;
    rosters: Roster[];
    expanded: boolean;
  }[] = [];

  currentPage = 1;
  pageSize = 10;
  totalItems = 0; 
  totalPages = 0; 
  saving = false;

  constructor(
    private rosterService: RosterService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadRosters();
  }

  loadRosters() {
    this.rosterService.getRosters().subscribe(apiRosters => {

      this.rosters = RosterMapper.fromApiList(apiRosters);
      this.totalItems = this.rosters.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.paginateAndGroupRosters();
    });
  }

  private paginateAndGroupRosters() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginated = this.rosters.slice(startIndex, endIndex);

    const map = new Map<string, Roster[]>();
    paginated.forEach(r => {
      const name = r.name || 'N/A';
      if (!map.has(name)) map.set(name, []);
      map.get(name)!.push(r);
    });

    this.groupedRosters = Array.from(map.entries()).map(([rosterName, rosters]) => ({
      rosterName,
      rosters,
      expanded: false
    }));
  }

  private groupRosters() {
    const map = new Map<string, Roster[]>();
    
    this.rosters.forEach(r => {
      const name = r.name || 'N/A';

      if (!map.has(name)) map.set(name, []);
      map.get(name)!.push(r);
      });

    this.groupedRosters = Array.from(map.entries()).map(([rosterName, rosters]) => ({
      rosterName,
      rosters,
      expanded: false
    }));
  }

  searchRoster() {
    const nameTerm = this.searchTerm1.trim();
  
    if (!nameTerm) {
      this.loadRosters();
      return;
    }

    const handleSearchResponse = (res: Roster[]) => {
      this.rosters = res;
      this.currentPage = 1;
      this.totalItems = this.rosters.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.paginateAndGroupRosters();
    };
    
    return this.rosterService.searchRoster(nameTerm)
      .subscribe(handleSearchResponse)
  }

  handleSaveItem(event: any) {
    const { rosterName, weeklyWorkload, dailySchedules, dutySchedules } = event;

    if (dailySchedules) {
      this.createDailyRoster(rosterName, weeklyWorkload, dailySchedules);
      
    } else if (dutySchedules) {
      this.createRosterDuty(rosterName, weeklyWorkload, dutySchedules);
    }
  }

  openAttachModal() {
    this.isAttachModalOpen = true;
  }

  closeAttachModal() {
    this.isAttachModalOpen = false;
  }

  createRosterDuty(
    name: string,
    weeklyWorkload: number,
    dutySchedules: { 
      startTime: string,
      workDuration: string,
      timeOff: string }
    ) {

    this.saving = true;
    const newRosterDuty = {
      name: name, 
      weeklyWorkload: weeklyWorkload, 
      dutySchedules: { 
        startTime: dutySchedules.startTime, 
        workDuration: Number(dutySchedules.workDuration), 
        timeOff: Number(dutySchedules.timeOff) 
      }
    };
        
    this.rosterService.createRosterDuty(newRosterDuty).subscribe({
      next: (created) => {
        this.closeAttachModal();
        this.notificationService.showSuccess("Roster Duty created successfully.");
        this.saving = false;
        this.loadRosters();
      },

      error: (err) => {
        this.saving = false;
        this.notificationService.showError("Failed to create Roster Duty");
      }
    });
  }

  createDailyRoster(
    name: string,
    weeklyWorkload: number, 
    dailySchedules: { 
      day: string,
      schedules: string[] 
    }[]
  ) {
    this.saving = true;
     const newDailyRoster = {
      name,
      weeklyWorkload,
      schedules: dailySchedules
    };

    this.rosterService.createDailyRoster(newDailyRoster).subscribe({
      next: (created) => {
        this.closeAttachModal();
        this.notificationService.showSuccess("Daily Roster created successfully.");
        this.saving = false;
        this.loadRosters();
      },
      
      error: (err) => {
        this.saving = false;
        this.notificationService.showError("Failed to create Daily Roster.");
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateAndGroupRosters();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateAndGroupRosters();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateAndGroupRosters();
    }
  }
}
