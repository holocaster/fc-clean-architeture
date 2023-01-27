export interface InputCreateProductDTO {
    name: string;
    type: string;
    price: number;
}

export interface OutputCreateProductDTO {
    id: string;
    name: string;
    price: number;
}