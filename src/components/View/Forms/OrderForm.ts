import { ensureElement } from "../../../utils/utils";
import { ensureAllElements } from "../../../utils/utils";
import { Form, FormData } from "./Form";
import { IEvents } from "../../base/Events";
import { TPayment } from "../../../types";

interface OrderFormData extends FormData {
    payment: TPayment | null
    adress: string
}

export class OrderForm extends Form<OrderFormData> {
    protected paymentButtons: HTMLButtonElement[]
    protected adressInput: HTMLInputElement

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container)
        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container)
        this.adressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);

        this.paymentButtons.forEach(element => {
            element.addEventListener('click', () => {
                this.events.emit('payment:changed', {payment: element.name as TPayment})
            })
        });

        this.adressInput.addEventListener('input', () => {
            this.events.emit('address:changed', {address: this.adressInput.value})
        })
    }

    set payment(value: TPayment | null) {
        for (const element of this.paymentButtons) {
            if (element.name === value) {
                element.classList.add('button_alt-active')
            } else {
                element.classList.remove('button_alt-active')
            }
        }
    }

    set adress(value: string) {
        this.adressInput.value = value
    }
}