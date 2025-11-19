import {Injectable} from '@angular/core';
import katex, {KatexOptions} from 'katex';

@Injectable({
  providedIn: 'root'
})
export class LatexService {

  renderToString(equation: any, options?: KatexOptions): string {
    return katex.renderToString(equation, options);
  }
}