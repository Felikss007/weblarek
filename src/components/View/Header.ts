import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface HeaderData {
    counter: number
}

export class Header extends Component<HeaderData> {
    protected basketButton: HTMLButtonElement
    protected counterElement: HTMLElement

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container)

        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container)
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container)


        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:opened')
        })
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value)
    }
}