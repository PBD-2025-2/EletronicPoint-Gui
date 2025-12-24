import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-eletronic-points',
  imports: [MenubarModule],
  templateUrl: './eletronic-points.html',
  styleUrl: './eletronic-points.scss'
})
export class EletronicPoints {

  items: MenuItem[] = [
    {
      label: 'Filters',
      items: [
        {
          label: 'By Id'
        },
        {
          label: 'Label 2'
        },
        {
          label: 'Label 3'
        }
      ]
    }
  ]
openModal() {
throw new Error('Method not implemented.');
}
searchCompanies() {
throw new Error('Method not implemented.');
}
searchTerm: any;

}
