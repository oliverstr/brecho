import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Sale } from '../models/sale.model';

@Injectable({
    providedIn: 'root'
})
export class SaleService {

    saleFB: Observable<Sale[]>;
    saleRef: AngularFireList<Sale[]>;

    constructor(private db: AngularFireDatabase) {
        this.saleRef = this.db.list('sales');
        this.saleFB = this.saleRef.snapshotChanges()
            .pipe(
                map(changes => {
                    return changes.map(c => {
                        return new Sale(
                            c.payload.key,
                            c.payload.val()['date'],
                            c.payload.val()['produtos'],
                            c.payload.val()['desconto'],
                            c.payload.val()['valorBruto'],
                            c.payload.val()['valorLiquido'],
                            c.payload.val()['brechoKey']
                        );
                    });
                })
            );
    }

    add(item) {
        return this.saleRef.push(item);
    }

    remove(item) {
        return this.saleRef.remove(item.key);
    }

    removeAll() {
        return this.saleRef.remove();
    }

    removeSoft(item) {
        item.active = false;
        return this.saleRef.update(item.key, item);
    }

    edit(item) {
        return this.saleRef.update(item.key, item);
    }

    getByQuery(params): Observable<Sale[]> {
        const saleRef = this.db.list('sales', ref => ref.orderByChild(params.orderBy).equalTo(params.equalTo));
        return saleRef.snapshotChanges()
            .pipe(
                map(changes => {
                    return changes.map(c => {
                        return new Sale(
                            c.payload.key,
                            c.payload.val()['date'],
                            c.payload.val()['produtos'],
                            c.payload.val()['desconto'],
                            c.payload.val()['valorBruto'],
                            c.payload.val()['valorLiquido'],
                            c.payload.val()['user'],
                            c.payload.val()['brechoKey']
                        );
                    });
                })
            );
    }

}
