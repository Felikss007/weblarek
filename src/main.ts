import './scss/styles.scss';
import { ContactsForm } from './components/View/Forms/ContactsForm';
import { Form } from './components/View/Forms/Form';
import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { OrderForm } from './components/View/Forms/OrderForm';
import { ShopApi } from './components/Models/ShopApi';
import { BasketView } from './components/View/BasketView';
import { Gallery } from './components/View/Gallery';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Header } from './components/View/Header';
import { OrdesSuccess } from './components/View/OrdesSuccess';
import { CardCatalog } from './components/View/Cards/CardCatelog';
import { Modal } from './components/View/Modal';
import { CardBasket } from './components/View/Cards/CardBasket';
import { CardPreview } from './components/View/Cards/CardPreview';
import { ProductCard } from './components/View/Cards/ProductCard';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureAllElements, ensureElement } from './utils/utils';
import { IBuyer, IProduct, TPayment } from './types';
import { IOrder } from './types';


const events = new EventEmitter

const productsModel = new Catalog(events)
const basketModel = new Basket(events)
const buyerModel = new Buyer(events)

const header = new Header(events, ensureElement<HTMLElement>('.header'))
const modal = new Modal(events, ensureElement<HTMLElement>('.page'))
const gallery = new Gallery(ensureElement<HTMLElement>('.page__wrapper'))

const basketView = new BasketView(events, cloneTemplate<HTMLElement>('#basket'))
const api = new Api(API_URL)
const shopApi = new ShopApi(api)
const orderSuccess = new OrdesSuccess(events, cloneTemplate<HTMLElement>('#success'))
const cardPreview  = new CardPreview({
    onClick: () => {
        const product = productsModel.getSelectedProduct()
        if(product) {
            events.emit('card:toggle', {id: product.id})
        }
    }
},
    cloneTemplate<HTMLElement>('#card-preview')
)

const orderForm = new OrderForm(events, cloneTemplate<HTMLElement>('#order'))
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLElement>('#contacts'))

events.on('catalog:changed', () => {
    const cards = productsModel.getProducts().map((product) => {
        const card = new CardCatalog(
            { onClick: () => events.emit('card:selected', product) },
            cloneTemplate<HTMLElement>('#card-catalog')
        );
        return card.render(product);
    });

    gallery.render({ catalog: cards });
});

events.on<IProduct>('card:selected', (product) => {
    productsModel.setSelectedProduct(product)
})

events.on('product:selected', () => {
    const product = productsModel.getSelectedProduct()
    if (product === null) return
 
  const inBasket = basketModel.hasId(product.id)
  const content = cardPreview.render({
    ...product,
    buttonText: product.price === null ? 'Недоступно' : inBasket === true ? 'Удалить из карзины' : 'Купить',
    buttonDisabled: product.price === null
  })
  modal.content = content
  modal.open()
})
events.on<{id: string}>('card:toggle', ({id}) => {
    const product = productsModel.getProductById(id)
    if (!product) {
        return
    }
    if (basketModel.hasId(id)) {
        basketModel.delItem(id)
    } else {
        if (product.price === null) {
            return
        }
        basketModel.addItem(product)
    }
    modal.close()
})

events.on('basket:changed', () => {
    const products = basketModel.getItems()
    const cards: HTMLElement [] = []
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        const card = new CardBasket({onClick: () => events.emit('basket:delete', {id: product.id})},cloneTemplate<HTMLElement>('#card-basket'))
        cards.push(card.render({...product, index: i + 1}))
    }
    basketView.render({items: cards, price: basketModel.getTotalPrice(), valid: basketModel.getCount() > 0})
    header.render({counter: basketModel.getCount()})
})

events.on('basket:opened', () => {
    modal.content = basketView.render()
    modal.open()
})



events.on('success:closed', () => {
    modal.close()
})

events.on<{id: string}>('basket:delete', ({id}) => {
    basketModel.delItem(id)
})

events.on('basket:order', () => {
    const content = orderForm.render()
    modal.content = content
    modal.open()
})

events.on('modal:closed', () => {
    modal.close()
})

events.on<{ payment: TPayment }>('payment:changed', ({ payment }) => {
    buyerModel.updateData({ payment });
});

events.on<{form: Form<any>}>('form:submit', ({form}) => {
    if (form instanceof OrderForm) {
        const content = contactsForm.render()
        modal.content = content
        modal.open()
    }
    if (form instanceof ContactsForm) {
        const buyer = buyerModel.getBuyer()
        const products = basketModel.getItems()
        const payload: IOrder = {...buyer, total: basketModel.getTotalPrice(), items: products.map(product => product.id)}
        shopApi.postOrder(payload)
        .then((result) => {
            modal.content = orderSuccess.render({price: result.total})
            modal.open()
            basketModel.clearBasket()
            buyerModel.clearBuyer()
        })
        .catch((err) => {
            console.error('Ошибка заказа', err)
        })
    }
})

events.on('buyer:changed', () => {
    const buyer = buyerModel.getBuyer()
    const errors = buyerModel.validate()


    orderForm.render({
        payment: buyer.payment,
        adress: buyer.address,
        valid: !errors.payment && !errors.address,
        errors: errors.address ?? (!errors.payment ? '' : errors.payment)
    })

    let errMessage = ''
    if (errors.email && errors.phone) {
        errMessage = `${errors.email}, ${errors.phone}`
    }else if (errors.email) {
        errMessage = errors.email
    } else if (errors.phone) {
        errMessage = errors.phone
    }
    contactsForm.render({
        email: buyer.email,
        phone: buyer.phone,
        valid: !errors.email && !errors.phone,
        errors: errMessage
    })
})

/*events.on<{address: IBuyer}>('address:changed', ({address}) => {
    buyerModel.updateData(address)
})*/

events.on<{ address: string }>('address:changed', ({ address }) => {
    buyerModel.updateData({ address });
});

events.on<{ email: string }>('email:changed', ({ email }) => {
    buyerModel.updateData({ email });
});

events.on<{ phone: string }>('phone:changed', ({ phone }) => {
    buyerModel.updateData({ phone });
});
/*
events.on<{email: IBuyer}>('email:changed', ({email}) => {
    buyerModel.updateData(email)
})

events.on<{phone: IBuyer}>('phone:changed', ({phone}) => {
    buyerModel.updateData(phone)
})*/






shopApi.getProducts()
    .then((data) => {
        productsModel.setProducts(data.items);
    })
    .catch((err) => console.error(err));







//Это я оставил для себя   
//Проверка Catalog
/*const catalog = new Catalog;

catalog.setProducts(apiProducts.items)
const allProducts = catalog.getProducts()
console.log('Массив всех товаров каталога:', allProducts)

console.log(catalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'))

const secProduct = allProducts[1]
if(secProduct) {
    const findProduct = catalog.getProductById(secProduct.id)

    console.log('Айди продукта: ' , secProduct.id + ', Найденный продукт: ' , findProduct)


 if(findProduct) {
    catalog.setSelectedProduct(findProduct)
    const selectedProduct = catalog.getSelectedProduct()

    console.log('Выбранный продукт', selectedProduct)
 }
}
//Проверка Catalog завершена


//Проверка Basket(Корзины)
const basket = new Basket

const itemsAddInBasket = apiProducts.items.slice(0, 2)
if (itemsAddInBasket.length !== 0) {
    itemsAddInBasket.forEach((item) => {
        basket.addItem(item)
        console.log('Товар с названием: "' + item.title + '" добавлен в корзину')
    })

    console.log('Количество товаров в корзине:', basket.getCount())


    const itemsInBasket = basket.getItems()
    console.log('Товары в корзине:', itemsInBasket.map((t) => t.title).join(', '))

    console.log('Общая стоимость корзины:', basket.getTotalPrice())

    const secProduct = itemsAddInBasket[1]
    const findProduct = basket.hasId(secProduct.id)

      console.log(
    `Продукт "${secProduct.title}" в корзине:`,
    findProduct ? "НАЙДЕН " : "НЕ НАЙДЕН ",

    
  );


  const productRemove = itemsAddInBasket[1]
  if (productRemove) {
    basket.delItem(productRemove.id)
    console.log('Удален товар:', productRemove.title)
    console.log('Количество товаров после удаления:', basket.getCount())
  }

  console.log('Очищение корзины...')
  basket.clearBasket()
  console.log('После очистки всей корзины товаров:', basket.getCount())

} else {
    console.log('Ошибка Basket не работает и (или) товаров нет в корзине')
}
//Проверка Basket(Корзины) завершена


//Проверка Buyer
const buyer = new Buyer();

buyer.updateData({
    email: 'praktikum@yandex.ru',
    phone: '8(800)700-93-29',
    address: 'Москва, ул. Льва Толстого, 16',
    payment: 'card'
})

const filledData = buyer.getBuyer();
console.log('База', filledData);

console.log("email:", filledData.email);
console.log("phone:", filledData.phone);
console.log("address:", filledData.address);
console.log("payment:", filledData.payment);

buyer.clearBuyer()
console.log('Покупатель после очистки:', buyer.getBuyer());


const validationErrors = buyer.validate()
const hasErrors = Object.keys(validationErrors).length > 0
if (hasErrors) {
    console.log('Форма заполнена неверно! Вот список ошибок:', validationErrors)
}else {
    console.log('Все отлично! Можно оформлять заказ!')
}
//Проверка Buyer завершена

//Проверка ShopApi и IApi
const api = new Api(API_URL)
const shopApi = new ShopApi(api)

async function getCatalog() {
    try {
        console.log('Отправление запроса')
        const response = await shopApi.getProducts()

        console.log('Ответ сервера:' ,response)
        
        //Если от сервера вообще ничего не пришло, ИЛИ пришел ответ, но в нём забыли прислать массив items — тогда заходим внутрь if.
        if (!response || !response.items) {
            console.error('Ошибка')
            return
        }

        catalog.setProducts(response.items)
        console.log('Список товаров:' ,catalog.getProducts())
        console.log('Количество товаров:', catalog.getProducts().length)

    } catch (err) {
        console.error('Ошибка', err)
    }
}

(async () => {
    console.log('Выполнениу')
    await getCatalog()
})()
*/

