import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ngxTrim]',
  standalone: true
})
export class NgxTrimDirective {
  private _onChange: (value: any) => void;
  private _onTouched: () => any;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      const trimmedValue = value.replace(/\s+/g, ' ').trim();
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', trimmedValue);
    }
  }

  registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => any): void {
    this._onTouched = fn;
  }

  @HostListener('blur', ['$event'])
  private _onBlur(event: Event): void {
    const element = event.target as HTMLInputElement;
    const val = element.value.replace(/\s+/g, ' ').trim();
    this.writeValue(val);
    if (this._onChange) this._onChange(val);
  }

  @HostListener('input', ['$event'])
  private _onInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    const val = element.value;
    if (this._onChange) this._onChange(val); // Call onChange on each input event
  }
}
