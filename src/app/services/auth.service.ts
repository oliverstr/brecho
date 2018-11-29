import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { UsersService } from './users.service';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedUser: User;

  constructor( public firebaseAuth: AngularFireAuth, private usersService: UsersService, private toaster: ToastrService ) {
    this.firebaseAuth.user.subscribe(loggedUser => {
      if (loggedUser) {
        this.usersService.usersFB.subscribe(users => {
          const authenticate = users.find(user => user.email === loggedUser.email);
          if (authenticate) {
            authenticate.displayName = loggedUser.displayName;
            authenticate.imageUrl = loggedUser.photoURL;
            this.usersService.edit(authenticate);
            this.loggedUser = authenticate;
          } else {
            this.toaster.error('Você não tem autorização para acessar o sistema.', 'Não autorizado');
            this.logout();
          }
        });
      }
    });
   }

  loginWithGoogle() {
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.firebaseAuth.auth.signOut();
    this.loggedUser = null;
  }
}
