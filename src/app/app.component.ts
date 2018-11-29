import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BrechoService } from './services/brecho.service';
import { Subscription } from 'rxjs';
import { Brecho } from './models/brecho.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public brechos: Brecho[];
  private brechosSubscription: Subscription;

  constructor(public authService: AuthService, public brechoService: BrechoService) { }

  ngOnInit() {
    this.brechosSubscription = this.brechoService.brechoFB.subscribe(items => {
      this.brechos = items;
      this.brechoService.selectedBrecho = items[items.length - 1];
    });
  }

  ngOnDestroy() {
    this.brechosSubscription.unsubscribe();
  }

  loginGoogle() {
    this.authService.loginWithGoogle();
  }

  logout() {
    this.authService.logout();
  }
}
