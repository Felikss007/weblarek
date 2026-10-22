import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
    private products: IProduct[] = []
    private selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    public setProducts(products: IProduct[]) {
        this.products = products
        this.events.emit('catalog:changed')
    }

    public getProducts(): IProduct[] {
        return this.products
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id)
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product
        this.events.emit('product:selected')
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct
    }
}