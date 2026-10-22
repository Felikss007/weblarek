import { IProduct } from "../../types";
import { IEvents } from "../base/Events";


export class Basket {
    private items: IProduct[];

    constructor(protected events: IEvents) {
        this.items = []
    }

    public getItems(): IProduct[] {
        return this.items
    }

    public addItem(product: IProduct): void {
        this.items.push(product)
        this.events.emit('basket:changed')
    }

    public delItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id)
        this.events.emit('basket:changed')
    }

    public clearBasket(): void {
        this.items = []
        this.events.emit('basket:changed')
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