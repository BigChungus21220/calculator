import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GraphModule } from './graph/graph.component';
import { ExpressionListComponent } from './expressionList/expressionList.component';
import { ThemeToggleComponent } from './themeToggle/themeToggle.component';
import { SplitPaneComponent, SplitPaneLeftComponent, SplitPaneRightComponent } from './splitPane/splitPane.component';
// pi-save
// pi-th-large
// pi-images -> modify to be graphs

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    GraphModule,
    ExpressionListComponent,
    ThemeToggleComponent,
    SplitPaneComponent,
    SplitPaneLeftComponent,
    SplitPaneRightComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'calculator';

  @Input('graphTitle') graphTitle: string = 'Untitled graph';
}
