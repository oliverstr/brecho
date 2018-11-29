import { BaseModel } from './base-model.interface';
import { EMPTY } from './validators';
import { Sale } from './sale.model';

export class Brecho implements BaseModel {
    constructor(
        public key = '',
        public nome?: string,
        public data?: Date,
        public active = true,
        public sales: Sale[] = []
        ) {}

    getColumnsConfig(): Object {
        return {
            nome: { title: 'Nome', validators: [EMPTY] },
            data: { title: 'Data', validators: [EMPTY] }
        };
    }
}
