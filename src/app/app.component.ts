import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { GraphModule } from './graph/graph.component';
import { ExpressionListComponent } from './expressionList/expressionList.component';
import { MenubarModule } from 'primeng/menubar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
import { PrimeIcons, MenuItem } from 'primeng/api';
import { ThemeToggleComponent } from './themeToggle/themeToggle.component';
// pi-save
// pi-th-large
// pi-images -> modify to be graphs

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    SplitterModule,
    GraphModule,
    MenubarModule,
    ScrollPanelModule,
    PanelModule,
    ExpressionListComponent,
    ThemeToggleComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'calculator';

  @Input('graphTitle') graphTitle: string = 'Untitled graph';
  
  // need to replace the menu with some good ol html bc this sucks ass

  items: MenuItem[] = [
    {
      label: 'Plots',
      icon: 'ci ci-graphs'
    },
    {
      icon: PrimeIcons.SAVE
    },
    {
      label: 'Untitled Graph',
    },
    {
      label: 'Share',
      icon: PrimeIcons.SHARE_ALT
    },
    {
      label: 'Account',
      icon: PrimeIcons.USER
    }
  ];
}
