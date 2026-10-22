import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface FormData {
    valid: boolean
    errors: string
}

export class Form<T> extends Component<T> {
    protected formElement: HTMLFormElement
    protected formErrors: HTMLSpanElement
    protected submitButton: HTMLButtonElement

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container)

        this.formElement = this.container as HTMLFormElement
        this.formErrors = ensureElement<HTMLSpanElement>('.form__errors', this.container)
        this.submitButton = ensureElement<HTMLButtonElement>('[type="submit"]', this.container);

        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault()
            this.events.emit('form:submit', {form: this}) 
        })
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value
    }

    set errors(value: string) {
        this.formErrors.textContent = value
    }
}