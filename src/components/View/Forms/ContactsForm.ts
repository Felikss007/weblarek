import { ensureElement } from "../../../utils/utils";
import { Form, FormData } from "./Form";
import { IEvents } from "../../base/Events";

interface ContactsFormData extends FormData {
    email: string
    phone: string
}

export class ContactsForm extends Form<ContactsFormData> {
    protected emailInput: HTMLInputElement
    protected phoneInput: HTMLInputElement


    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container)

        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container)
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container)

        this.emailInput.addEventListener('input', () => {
            this.events.emit('email:changed', {email: this.emailInput.value})
        })

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('phone:changed', {phone: this.phoneInput.value})
        })
    }

    set email(value: string) {
        this.emailInput.value = value
    }

    set phone(value: string) {
        this.phoneInput.value = value
    }
}