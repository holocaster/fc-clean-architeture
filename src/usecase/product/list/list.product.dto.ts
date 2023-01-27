export interface InputListProductDTO {

}

type ProductDTO = {
    id: string;
    name: string;
    price: number;
}

export interface OutputListProductDTO {
    products: ProductDTO[];
}