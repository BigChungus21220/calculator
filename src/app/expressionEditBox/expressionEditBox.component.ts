import { Component, Input, Inject, PLATFORM_ID, ElementRef, OnChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import katex from 'katex';

@Component({
  selector: 'c-expression-edit-box',
  imports: [],
  standalone: true,
  templateUrl: './expressionEditBox.component.html',
  styleUrl: './expressionEditBox.component.scss'
})
export class ExpressionEditBoxComponent implements OnChanges {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private elm: ElementRef) {}
  @Input('tex') tex: string = '';

  ngOnChanges() {
    if (!isPlatformBrowser(this.platformId)) return;

    katex.render(this.tex, this.elm.nativeElement, {throwOnError: false, displayMode: false, output:'mathml'});
  }
}