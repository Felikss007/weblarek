import { IProduct } from "../../types";


export class Basket {
    private items: IProduct[];

    constructor() {
        this.items = []
    }

    public getItems(): IProduct[] {
        return this.items
    }

    public setItems(product: IProduct): void {
        this.items.push(product)
    }

    public delItems(id: string): void {
        this.items = this.items.filter(item => item.id !== id)
    }

    public clearBasket(): void {
        this.items = []
    }


    public getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            const price = item.price ?? 0;
            return total + price
        }, 0)
    }

    public getCount(): number {
        return this.items.length
    }

    public hasId(id: string): boolean {
        return this.items.some(item => item.id === id)
    }
}