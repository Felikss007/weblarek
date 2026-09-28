import './scss/styles.scss';


import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { ShopApi } from './components/Models/ShopApi';


import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

//Проверка Catalog
const catalog = new Catalog;

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
