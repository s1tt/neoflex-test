import { cartCount, cartCountActiveSelector, cartItems, templateCardIdFromCart, totalPriceEl, totalItemsCount } from './constants.js';

//Если при загрузке страницы в session storage есть нужные объекты, отрисовываем количество на значке корзины
if (totalItemsCount > 0) {
  cartCount.classList.add(cartCountActiveSelector);
  cartCount.textContent = totalItemsCount;
}

function createCardElement(element) {
  const cardElement = document.querySelector(templateCardIdFromCart).content.querySelector('.cart__card').cloneNode(true);

  const cardElementImg = cardElement.querySelector('.cart__card-img');
  const cardElementTitle = cardElement.querySelector('.cart__card-title');
  const cardElementPriceCurrent = cardElement.querySelector('.cart__card-price');
  const cardItemCount = cardElement.querySelector('.cart__card-count-num');
  const cardMinusBtn = cardElement.querySelector('.cart__card-count-minus');
  const cardPlusBtn = cardElement.querySelector('.cart__card-count-plus');
  const cardItemTotalPrice = cardElement.querySelector('.cart__card-total-price');
  const cardDeleteBtn = cardElement.querySelector('.cart__card-delete-btn');

  const { img, title, price, count } = element;

  cardElementImg.src = img;
  cardElementImg.alt = title;
  cardElementTitle.textContent = title;
  cardElementPriceCurrent.textContent = `${price.toLocaleString('ru-RU')} ₽`;
  cardItemCount.textContent = count;
  cardItemTotalPrice.textContent = `${(count * price).toLocaleString('ru-RU')} ₽`;

  function handleUpdateCard(event, MathSymbol) {
    //получаем данные из хранилища
    const totalCounts = JSON.parse(sessionStorage.getItem('totalCounts'));
    const cart = JSON.parse(sessionStorage.getItem('cart'));

    //обновление значения тотал прайса после нажатия на минус или плюс на странице
    totalCounts.totalPrice = MathSymbol === '+' ? totalCounts.totalPrice + price : totalCounts.totalPrice - price;
    totalPriceEl.textContent = `₽ ${totalCounts.totalPrice.toLocaleString('ru-RU')}`;

    //обновление значения тотал товаров после нажатия на минус или плюс на странице
    totalCounts.totalQuantity = MathSymbol === '+' ? totalCounts.totalQuantity + 1 : totalCounts.totalQuantity - 1;
    cartCount.textContent = totalCounts.totalQuantity;

    //есл тотал товаров = 0, убрать счетчик с иконки в хедере
    if (totalCounts.totalQuantity === 0) {
      cartCount.classList.remove(cartCountActiveSelector);
    }

    //обновление значения количества ОДНОГО вида товара после нажатия на минус или плюс на странице
    const targetProduct = cart.find(product => product.id === element.id);
    //обновление счетчика в карточке товара
    targetProduct.count = MathSymbol === '+' ? targetProduct.count + 1 : targetProduct.count - 1;
    cardItemCount.textContent = targetProduct.count;

    // обновление цены в карточке товара
    cardItemTotalPrice.textContent = `${(targetProduct.count * price).toLocaleString('ru-RU')}  ₽`;

    //Если счетчик товара = 0
    if (targetProduct.count === 0) {
      //удаляем карточку со страницы
      event.target.closest('.cart__card').remove();
      //удаляем инфо о товаре из хранилища
      const index = cart.indexOf(targetProduct);
      cart.splice(index, 1);
    }

    //Обновляем данные в хранилище
    sessionStorage.setItem('totalCounts', JSON.stringify(totalCounts));
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }

  function handleDeleteCard(event) {
    //получаем данные из хранилища
    const totalCounts = JSON.parse(sessionStorage.getItem('totalCounts'));
    const cart = JSON.parse(sessionStorage.getItem('cart'));

    //обновление значения тотал прайса после удаления карточки на странице и в сторедже
    totalCounts.totalPrice = totalCounts.totalPrice - parseInt(cardItemTotalPrice.textContent.replace(/\s/g, ''), 10);
    totalPriceEl.textContent = `₽ ${totalCounts.totalPrice.toLocaleString('ru-RU')}`;

    //обновление значения тотал товаров после удаления карточки на странице и в сторедже
    totalCounts.totalQuantity = totalCounts.totalQuantity - parseInt(cardItemCount.textContent, 10);
    cartCount.textContent = totalCounts.totalQuantity;

    //есл тотал товаров < 1, убрать счетчик с иконки в хедере
    if (totalCounts.totalQuantity === 0) {
      cartCount.classList.remove(cartCountActiveSelector);
    }

    //удалить карточку со стриницы
    event.target.closest('.cart__card').remove();

    //удалить карточку со стореджа
    const targetProduct = cart.find(product => product.id === element.id);
    const index = cart.indexOf(targetProduct);
    cart.splice(index, 1);

    //Обновляем данные в хранилище
    sessionStorage.setItem('totalCounts', JSON.stringify(totalCounts));
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }

  //Обработчик на минус кнопку
  cardMinusBtn.addEventListener('click', event => handleUpdateCard(event, '-'));

  //Обработчик на плюс кнопку
  cardPlusBtn.addEventListener('click', event => handleUpdateCard(event, '+'));

  //Обработчик на удалить кнопку
  cardDeleteBtn.addEventListener('click', event => handleDeleteCard(event));

  return cardElement;
}

function generateTemplateCard() {
  //отрисовываем тотал прайс при открытии страницы корзины
  totalPriceEl.textContent = sessionStorage.getItem('totalCounts') ? `₽ ${JSON.parse(sessionStorage.getItem('totalCounts')).totalPrice.toLocaleString('ru-RU')}` : 0;

  //Получаем массив объектов с товарами, лежащими в корзине
  const productsInCart = JSON.parse(sessionStorage.getItem('cart'));

  //проходим по массиву и отрисовываем каждую карточку
  productsInCart.forEach(element => cartItems.append(createCardElement(element)));
}

generateTemplateCard();
