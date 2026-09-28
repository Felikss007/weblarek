import { IProduct } from "../../types";

export class Catalog {
    private products: IProduct[] = []
    private selectedProduct: IProduct | null = null;

    constructor() {}

    public setProducts(products: IProduct[]) {
        this.products = products
    }

    public getProducts(): IProduct[] {
        return this.products
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id)
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct
    }
}