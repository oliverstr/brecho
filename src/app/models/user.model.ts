import { BaseModel } from './base-model.interface';
import { EMPTY } from './validators';

export class User implements BaseModel {
    constructor(
        public key: string = '',
        public adm: string = 'Não',
        public displayName: string = '',
        public email?: string,
        public imageUrl: string = '',
        public active: boolean = true,
    ) { }
    getColumnsConfig(): Object {
        return {
            email: { title: 'E-mail', validators: [EMPTY], unique: true },
            adm: {
                title: 'Administrador',
                validators: [],
                editor: {
                    type: 'checkbox',
                    config: {
                        true: 'Sim',
                        false: 'Não',
                    },
                }
            }
        };
    }
}
