import { IApi, IProductResponse, IOrder, IOrderResponse } from "../../types";


export class ShopApi {
    private api: IApi

    constructor(api: IApi) {
        this.api = api
    }

    async getProducts(): Promise<IProductResponse> {
        return this.api.get('/product')
    }


    async postOrder(payload: IOrder): Promise<IOrderResponse> {
        return this.api.post('/order', payload) as Promise<IOrderResponse>
    }
}