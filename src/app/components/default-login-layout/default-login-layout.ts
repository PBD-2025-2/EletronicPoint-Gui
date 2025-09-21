import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-default-login-layout',
  templateUrl: './default-login-layout.html',
  styleUrls: ['./default-login-layout.scss']
})
export class DefaultLoginLayout {
  @Input() title: string = '';
  @Input() primaryBtnText: string = '';
  @Input() secondaryBtnText: string = '';
}
