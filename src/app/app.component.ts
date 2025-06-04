import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <h1>Mi Aplicación Angular</h1>
  <router-outlet></router-outlet>
`,
imports: [RouterModule]
})
export class AppComponent {}
