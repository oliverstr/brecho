import { Product } from './product.model';

export class Sale {
    constructor(
        public key: string = '',
        public date?: any,
        public produtos: SaleItem[] = [],
        public desconto = 0,
        public valorBruto = 0,
        public valorLiquido = 0,
        public user?: string,
        public brechoKey?: string
    ) { }
}

export class SaleItem {
    constructor(
        public produto?: Product,
        public quantidade?: number,
        public valorTotal = 0
    ) {}
}
