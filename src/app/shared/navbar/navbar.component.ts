import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  constructor(private readonly tokenService: TokenService,
    private readonly router: Router,
  ) { }
  LogOut() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
