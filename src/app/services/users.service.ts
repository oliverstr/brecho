import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersFB: Observable<User[]>;
  usersRef: AngularFireList<User[]>;

  constructor(private db: AngularFireDatabase, private http: HttpClient) {
    this.usersRef = this.db.list('users', ref => ref.orderByChild('active').equalTo(true));
    this.usersFB = this.usersRef.snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            return new User(
              c.payload.key,
              c.payload.val()['adm'],
              c.payload.val()['displayName'],
              c.payload.val()['email'],
              c.payload.val()['imageUrl'],
              c.payload.val()['active']
            );
          });
        })
      );
  }

  add(item) {
    return this.usersRef.push(item);
  }

  remove(item) {
    return this.usersRef.remove(item.key);
  }

  removeAll() {
    return this.usersRef.remove();
  }

  removeSoft(item) {
    item.active = false;
    return this.usersRef.update(item.key, item);
  }

  edit(item) {
    return this.usersRef.update(item.key, item);
  }

  getByQuery(params): Observable<Product[]> {
    // tslint:disable-next-line:forin
    for (const key in params) {
      params[key] = `"${params[key]}"`;
    }
    return this.http.get<Product[]>(`${environment.firebase.databaseURL}/users.json`, { params })
    .pipe(
      map(response => {
        const items = [];
        if (response) {
          Object.keys(response).map(id => {
            const item: any = response[id];
            item.key = id;
            items.push(item);
          });
        }
        return items;
      })
    );
  }
}

