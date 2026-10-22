import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ModalData {
    content: HTMLElement
}

export class Modal extends Component<ModalData> {
    protected modalElement: HTMLElement
    protected closeButton: HTMLButtonElement
    protected modalContent: HTMLElement


    constructor(protected events: IEvents, container: HTMLElement) {
        super(container)

        this.modalElement = ensureElement<HTMLElement>('.modal', this.container)
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container)
        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container)

         this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:closed')
         })

         this.modalElement.addEventListener('click', () => {
            if (event?.target === this.modalElement) {
                this.events.emit('modal:closed')
            }
         })
    }

    set content(element: HTMLElement) {
        this.modalContent.replaceChildren(element)
    }

    open(): void {
        this.modalElement.classList.add('modal_active')
    }

    close(): void {
        this.modalElement.classList.remove('modal_active')
    }

    
}