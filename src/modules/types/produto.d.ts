enum StatusProduto {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO'
}

interface IProduto {
    id?: string;
    nome?:string;
    descricao?:string;
    id_categoria?:string;
    nome_categoria?:string;
    status?:StatusProduto;
    quantidade?:number;
    imagemproduto: string;
    preco?:number;
    criadoEm?:Date;
    atualizadoEm?:Date;
    eliminadoEm?:Date;
}