import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-time-input',
  standalone: true,
  imports: [FormsModule, NgxMaterialTimepickerModule],
  template: `
    <input
      class="schedule-input"
      [ngxTimepicker]="picker"
      [(ngModel)]="value"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
      [required]="required"
      [disabled]="disabled"
      type="text"
    />
    <ngx-material-timepicker #picker [format]="24"></ngx-material-timepicker>
  `,
  styles: [`
    .schedule-input {
      padding: 6px 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      width: 110px;
      text-align: center;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true
    }
  ]
})
export class TimeInputComponent implements ControlValueAccessor {
  @Input() required = false;
  @Input() disabled = false;

  value: string = '';

  // Funções para o ngModel
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
