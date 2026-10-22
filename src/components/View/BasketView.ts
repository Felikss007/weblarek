import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface BasketData {
    price: number
    items: HTMLElement[]
    valid: boolean
}

export class BasketView extends Component<BasketData> {
   protected basketList: HTMLUListElement
   protected basketPrice: HTMLSpanElement
   protected basketButton: HTMLButtonElement

   constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container)
    this.basketPrice = ensureElement<HTMLSpanElement>('.basket__price', this.container)
    this.basketList = ensureElement<HTMLUListElement>('.basket__list', this.container)

    this.basketButton.addEventListener('click', () => {
        this.events.emit('basket:order')
    })
   }

   set price(value: number) {
    this.basketPrice.textContent = `${value} синапсов`
   }

   set items(items: HTMLElement[]) {
    this.basketList.replaceChildren(...items)
   }

   set valid(value: boolean) {
    this.basketButton.disabled = !value
   }


}