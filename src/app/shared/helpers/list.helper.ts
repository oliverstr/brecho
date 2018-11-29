import { BaseModel } from 'src/app/models/base-model.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { Observable } from 'rxjs';

export class ListHelper {

    settings = {
        noDataMessage: 'Nenhum item encontrado.',
        actions: {
            columnTitle: 'Ações',
            position: 'right'
        },
        edit: {
            editButtonContent: 'Editar',
            saveButtonContent: 'Salvar',
            cancelButtonContent: 'Cancelar',
            confirmSave: true
        },
        add: {
            addButtonContent: 'Adicionar novo',
            createButtonContent: 'Salvar',
            cancelButtonContent: 'Fechar',
            confirmCreate: true
        },
        delete: {
            deleteButtonContent: 'Remover',
            confirmDelete: true
        },
        pager: {
            display: true,
            perPage: 10
        },
        columns: {}
    };
    bsModalRef: BsModalRef;
    data$: Observable<BaseModel[]>;

    constructor(
        private model: BaseModel,
        private modelInMessage: string,
        private modelIdentifier: string,
        private connectionService: any,
        public modalService: BsModalService) {
        this.settings.columns = model.getColumnsConfig();
    }

    validateForm(data, modalInfo) {
        // tslint:disable-next-line:forin
        for (const key in data) {
            let validationErrorMessage: string;
            if (this.model.getColumnsConfig()[key]) {
                this.model.getColumnsConfig()[key].validators.forEach(validator => {
                    if (!validator.validate(data[key])) {
                        validationErrorMessage = validator.message;
                        return;
                    }
                });
            }
            if (validationErrorMessage) {
                modalInfo.message = `
                    O formulário está preenchido incorretamente no campo: ${this.model.getColumnsConfig()[key].title}.
                    Mensagem: ${validationErrorMessage}
                `;
                modalInfo.title = 'Erro';
                modalInfo.showConfirmBtn = false;
                break;
            }
        }
    }

    hasDuplicate(data, tableSource, modalInfo) {
        return new Promise(res => {
            let duplicate = false;
            tableSource.getAll().then(items => {
                // tslint:disable-next-line:forin
                for (const key in data) {
                    const columnConfig = this.model.getColumnsConfig()[key];
                    if (columnConfig) {
                        if (columnConfig.unique) {
                            duplicate = items.find(listItem => (listItem[key] === data[key]) && (listItem.key !== data.key) );
                            if (duplicate) {
                                modalInfo.message = `O item ${duplicate[key]} já está cadastrado.`;
                                modalInfo.title = 'Erro';
                                modalInfo.showConfirmBtn = false;
                                break;
                            }
                        }
                    }
                }
                res(modalInfo);
            });

        });
    }

    async create(event) {
        const data = { ...this.model, ...event.newData };
        let modalInfo: any = {
            onConfirm: (val) => {
                if (val) {
                    this.connectionService.add(data).then(res => {
                        event.newData.key = res.key;
                        event.confirm.reject();
                    });
                }
            },
            message: `Deseja adicionar o ${this.modelInMessage} ${event.newData[this.modelIdentifier]}?`,
            title: 'Adicionar',
            confirmBtnName: 'Adicionar',
            showConfirmBtn: true
        };

        this.validateForm(event.newData, modalInfo);
        modalInfo = await this.hasDuplicate(data, event.source, modalInfo);
        this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState: modalInfo });
    }

    async edit(event) {
        const newData = event.newData;
        let modalInfo: any = {
            onConfirm: (val) => {
                if (val) {
                    this.connectionService.edit(newData);
                }
            },
            message: `Deseja editar o ${this.modelInMessage} ${event.data[this.modelIdentifier]}?`,
            title: 'Editar',
            confirmBtnName: 'Editar',
            showConfirmBtn: true
        };

        this.validateForm(event.newData, modalInfo);
        modalInfo = await this.hasDuplicate(event.newData, event.source, modalInfo);
        this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState: modalInfo });
    }

    delete(event) {
        const modalInfo = {
            onConfirm: (val) => {
                if (val) {
                    this.connectionService.removeSoft(event.data);
                }
            },
            message: `Deseja remover o ${this.modelInMessage} ${event.data[this.modelIdentifier]}?`,
            title: 'Remover',
            confirmBtnClass: 'btn-danger',
            confirmBtnName: 'Remover',
            showConfirmBtn: true
        };
        this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState: modalInfo });
    }
}
