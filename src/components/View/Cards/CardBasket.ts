import { ProductCard, ProductCardData } from "./ProductCard";
import { ensureElement } from "../../../utils/utils";

interface CardBasketData extends ProductCardData {
    index: number
}


interface CardBasketActions {
    onClick: () => void
}

export class CardBasket extends ProductCard<CardBasketData> {
    protected itemIndex: HTMLSpanElement
    protected deleteButton: HTMLButtonElement

    constructor(actions: CardBasketActions, container: HTMLElement) {
        super(container)

        this.itemIndex = ensureElement<HTMLSpanElement>('.basket__item-index', this.container)
        this.deleteButton = ensureElement<HTMLButtonElement>('.card__button', this.container)

        this.deleteButton.addEventListener('click', actions.onClick)
    }

    set index(value: number) {
        this.itemIndex.textContent = String(value)
    }
}