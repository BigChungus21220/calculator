// target ratio
// min left width
// min right width
// snap left closed
// snap right closed
// open / close shortcuts

import { Component, ViewChild, ElementRef, HostBinding, HostListener, Input, AfterViewInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'c-split-pane-left',
  template: `<ng-content></ng-content>`,
})
export class SplitPaneLeftComponent {}

@Component({
  selector: 'c-split-pane-right',
  template: `<ng-content></ng-content>`,
})
export class SplitPaneRightComponent {}

@Component({
  selector: 'c-split-pane',
  templateUrl: './splitPane.component.html',
  styleUrl: './splitPane.component.scss'
})
export class SplitPaneComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private host = inject(ElementRef<HTMLElement>);
  @ViewChild('leftPane') leftPane!: ElementRef;
  @ViewChild('rightPane') rightPane!: ElementRef;
  @ViewChild('handle') handle!: ElementRef;

  @Input('ratio') ratio : number = 0.5;

  isdragging : boolean = false;
  offset : number = 0;

  @HostBinding('style.--ratio')
  get cssRatio() {
    return `${this.ratio*100}%`;
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.isdragging = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
      if (this.isdragging){
        event.preventDefault();
        const width = this.host.nativeElement.getBoundingClientRect().width;
        let pos = event.clientX + this.offset;
        this.ratio = Math.min(Math.max(pos/width));
      }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    // this could fail, idk
    this.handle.nativeElement.addEventListener("mousedown", (event : MouseEvent) => {
      event.preventDefault();
      this.isdragging = true;
      const rect = this.leftPane.nativeElement.getBoundingClientRect();
      this.offset = rect.right - event.clientX;
      console.log("start drag")
    });
  }
}
