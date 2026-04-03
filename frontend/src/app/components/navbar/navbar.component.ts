import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  template: `
    <nav>
      <div>
        <a href="/shopping-cart">
          <i class="fa fa-shopping-cart"></i>
        </a>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {}
