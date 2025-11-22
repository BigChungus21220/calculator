import { Component } from '@angular/core';
import { ExpressionEditBoxComponent } from '../expressionEditBox/expressionEditBox.component';

@Component({
  selector: 'c-expression-list',
  imports: [
    ExpressionEditBoxComponent
  ],
  templateUrl: './expressionList.component.html',
  styleUrl: './expressionList.component.scss'
})
export class ExpressionListComponent {
  entries = [
    'x^{2}',
    'f\\left(x\\right) = \\sqrt{1 + x} - 1',
    `\\begin{bmatrix} 1 & 2 & 3\\\\ a & b & c \\end{bmatrix}`,
    `\\lnot a \\land b = \\lnot\\left(a \\lor \\lnot b\\right)`
  ];

  selectedEntries: number[] = [];
}