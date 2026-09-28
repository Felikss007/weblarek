import { IBuyer, TPayment } from "../../types";


//Тип для ошибок покупателя. 
// Разрешает создать объект, где ключи — это поля из IBuyer, значения — текст ошибки (string).
// Partial позволяет указывать ошибки не для всех полей сразу, а только там, где они есть.
type Errors = Partial<Record<keyof IBuyer, string>>

export class Buyer {
    private payment: TPayment | null;
    private address: string;
    private phone: string;
    private email: string;


    constructor() {
        this.payment = null
        this.address = ''
        this.phone = ''
        this.email = ''
    }

    // Partial делает все поля IBuyer необязательными (добавляет ?).
    // Это нужно, чтобы обновить кусок данных, но при этом TS не дал передать "левые" свойства, которых нет у IBuyer.
    public updateData(data: Partial<IBuyer>): void {
        if(data.payment !== undefined) {
            this.payment = data.payment
        }

        if(data.address !== undefined) {
            this.address = data.address
        }

        if (data.phone !== undefined) {
            this.phone = data.phone
        }

        if (data.email !== undefined) {
            this.email = data.email
        }
    }


    public getBuyer(): IBuyer {
        return {
        payment: this.payment,
        address: this.address,
        phone: this.phone,
        email: this.email
        }
    }

    public clearBuyer(): void {
        this.payment = null
        this.address = ''
        this.phone = ''
        this.email = ''

    }

    public validate(): Errors {
        const errors: Errors = {}
        if (this.payment === null) {
            errors.payment = 'Способ оплаты не выбран'
        }

        if (this.address.length === 0) {
            errors.address = 'Укажите адрес доставки'
        }

        if (this.phone.length === 0) {
            errors.phone = 'Укажите номер телефона'
        }

        if (this.email.length === 0) {
            errors.email = 'Укажите адрес электронной почты'
        }

        return errors
    }
}
