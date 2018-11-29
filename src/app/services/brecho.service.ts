import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Brecho } from '../models/brecho.model';

@Injectable({
  providedIn: 'root'
})
export class BrechoService {

  private _selectedBrecho: Brecho;
  get selectedBrecho() {
    return this._selectedBrecho;
  }
  set selectedBrecho(val) {
    this._selectedBrecho = val;
    this.onBrechoSelection.next(val);
  }

  onBrechoSelection: Subject<Brecho> = new Subject();

  brechoFB: Observable<Brecho[]>;
  brechoRef: AngularFireList<Brecho[]>;

  constructor(private db: AngularFireDatabase) {
    this.brechoRef = this.db.list('brechos', ref => ref.orderByChild('active').equalTo(true));
    this.brechoFB = this.brechoRef.snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => {
            return new Brecho(
              c.payload.key,
              c.payload.val()['nome'],
              c.payload.val()['data']
            );
          });
        })
      );
  }

  add(item) {
    return this.brechoRef.push(item);
  }

  remove(item) {
    return this.brechoRef.remove(item.key);
  }

  removeAll() {
    return this.brechoRef.remove();
  }

  removeSoft(item) {
    item.active = false;
    return this.brechoRef.update(item.key, item);
  }

  edit(item) {
    return this.brechoRef.update(item.key, item);
  }
}
