import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { DailyRoster, Roster, RosterDuty, RosterService } from '../../services/roster.service';
import { AddRosterModalComponent } from '../../components/add-roster-modal/add-roster-modal';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ViewDutySchedulesrModalComponent } from '../../components/view-dutySchedules-modal/view-dutySchedules-modal';
import { ViewDailySchedulesrModalComponent } from '../../components/view-dailySchedules-modal/view-dailySchedules-modal';
import { MatSelect, MatOption } from "@angular/material/select";

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule, AddRosterModalComponent, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, ViewDutySchedulesrModalComponent, ViewDailySchedulesrModalComponent, MatSelect, MatOption],
  templateUrl: './roster.html',
  styleUrl: './roster.scss'
})

export class RosterComponent {
  searchTerm1 = '';
  searchTerm2 = '';

  showAddRosterModal = false;
  showViewDutySchedulesModal = false;
  showViewDailySchedulesModal = false;

  rosters: Roster[] = [];
  selectedRoster!: Roster;
  selectedRosterDuty!: RosterDuty;
  selectedRosterDaily!: DailyRoster;
  

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

  filterValues = { id: '', name: '', type: '', weeklyWorkload: '' };
  type : string = '';

  displayedColumns: string[] = ['id', 'name', 'type', 'weeklyWorkload', 'actions'];
  dataSource = new MatTableDataSource<Roster>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('input') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private rosterService: RosterService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadRosters();

    this.dataSource.filterPredicate = function(data, filter: string)  {
      const parsedFilter = JSON.parse(filter);

      const onId = !parsedFilter.id || data.id?.toString().includes(parsedFilter.id);
      const onName = !parsedFilter.name || data.name?.toLowerCase().trim().includes(parsedFilter.name);
      const onWeeklyWorkload = !parsedFilter.weeklyWorkload || data.weeklyWorkload?.toString().includes(parsedFilter.weeklyWorkload);
      const onType = !parsedFilter.type || data.type?.toLowerCase().trim().includes(parsedFilter.type);

      return onId && onName && onWeeklyWorkload && onType;
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

    this.filterValues = {id: '', name: '', type:'', weeklyWorkload:'' };
    this.dataSource.filter = '';
    this.type = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.loadRosters();
  }

  filterById(event: Event) {
    this.filterValues.id = (event.target as HTMLInputElement).value.trim()
    this.applyFilter()
  }

  filterByRoleName(event: Event) {
    this.filterValues.name = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.applyFilter()
  }
  
  filterByRoleWeeklyWorkload(event: Event) {
    this.filterValues.weeklyWorkload = (event.target as HTMLInputElement).value.trim();
    this.applyFilter()
  }

  filterByRosterType(event: String) {
      this.filterValues.type = event.toLocaleLowerCase();
      this.applyFilter()
  }

  loadRosters() {
    this.rosterService.getRosters().subscribe({
      next: data => {
        this.rosters = data;
        this.dataSource.data = data

        this.totalItems = this.rosters.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.paginateAndGroupRosters();
      },
      error: err => {
        this.notificationService.showError("Error while loading roles");
      }
    });
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
      // Chamada para duty
      this.createRosterDuty(rosterName, weeklyWorkload, dutySchedules);
    }
  }

  openAddRosterModel() {
    this.showAddRosterModal = true;
  }

  openViewDutySchedulesModal(roster: RosterDuty) {
    this.selectedRosterDuty = roster;
    console.log("RosterDuty: ", this.selectedRosterDuty)
    this.showViewDutySchedulesModal = true;
  }
  
  openViewDailySchedulesModal(roster: DailyRoster) {
    this.selectedRosterDaily = roster;
    console.log("RosterDaily: ", this.selectedRosterDaily)
    this.showViewDailySchedulesModal = true;
  }

  closaAddRosterModel() {
    this.showAddRosterModal = false;
  }

  createRosterDuty(name: string, weeklyWorkload: number, dutySchedules: { startTime: string, workDuration: string, timeOff: string }) {

    this.saving = true;
    const newRosterDuty = {
      name: name,
      weeklyWorkload: weeklyWorkload,
      schedules: {
        startTime: dutySchedules.startTime,
        workDuration: Number(dutySchedules.workDuration),
        timeOff: Number(dutySchedules.timeOff)
      }
    };

    this.rosterService.createRosterDuty(newRosterDuty).subscribe({
      next: (created) => {
        this.showAddRosterModal = false
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

  createDailyRoster(name: string, weeklyWorkload: number, dailySchedules: { day: string, schedules: string[] }[]) {
    this.saving = true;
    const newDailyRoster = {
      name,
      weeklyWorkload,
      schedules: dailySchedules
    };

    console.log("NEW DAILY ROSTER:", newDailyRoster);
    this.rosterService.createDailyRoster(newDailyRoster).subscribe({
      next: (created) => {
        this.showAddRosterModal = false;
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
