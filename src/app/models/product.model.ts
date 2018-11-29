import { BaseModel } from './base-model.interface';
import { NUMBER, EMPTY } from './validators';

export class Product implements BaseModel {
    constructor(
        public key = '',
        public codigo?: string,
        public preco?: number,
        public brechoKey?: string,
        public active = true
        ) {}

    getColumnsConfig(): Object {
        return {
            codigo: { title: 'Código', validators: [EMPTY], unique: true },
            preco: { title: 'Preço', validators: [NUMBER, EMPTY], valuePrepareFunction: (cell) => `R$ ${Number(cell).toFixed(2)}` }
        };
    }
}
