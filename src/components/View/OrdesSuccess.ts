import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface SuccessData {
    price: number
}

export class OrdesSuccess extends Component<SuccessData> {
    protected titleOrderSuccess: HTMLParagraphElement
    protected orderButton: HTMLButtonElement
    protected priceOrder: HTMLHeadingElement

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container)

        this.titleOrderSuccess = ensureElement<HTMLParagraphElement>('.order-success__title', this.container)
        this.orderButton = ensureElement<HTMLButtonElement>('.button', this.container)
        this.priceOrder = ensureElement<HTMLHeadingElement>('.order-success__description', this.container)

        this.orderButton.addEventListener('click', () => {
            this.events.emit('success:closed')
        })
    }

    set price(value: number) {
        this.priceOrder.textContent = `Списано ${value} синапсов`
    }
}