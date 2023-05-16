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

  //если елемент не одходит, перехватим ошибку
  try {
    const { img, title, price } = JSON.parse(element);

    cardElementImg.src = img;
    cardElementImg.alt = title;
    cardElementTitle.textContent = title;
    cardElementPriceCurrent.textContent = `${price.toLocaleString('ru-RU')} ₽`;
    cardItemCount.textContent = sessionStorage.getItem(element);
    cardItemTotalPrice.textContent = `${(parseInt(cardItemCount.textContent, 10) * price).toLocaleString('ru-RU')} ₽`;

    //Обработчик на минус кнопку
    cardMinusBtn.addEventListener('click', event => {
      //обновление значения тотал прайса после нажатия на минус на странице и в сторедже
      let newTotalPrice = parseInt(sessionStorage.getItem('totalPrice'), 10) - price;
      totalPriceEl.textContent = `₽ ${newTotalPrice.toLocaleString('ru-RU')}`;
      sessionStorage.setItem('totalPrice', newTotalPrice);

      //обновление значения тотал товаров после нажатия на плюс на странице и в сторедже
      let newTotalItemsCount = parseInt(sessionStorage.getItem('totalItemsCount'), 10) - 1;
      cartCount.textContent = newTotalItemsCount;
      sessionStorage.setItem('totalItemsCount', newTotalItemsCount);

      //есл тотал товаров < 1, убрать счетчик с иконки в хедере
      if (parseInt(cartCount.textContent, 10) === 0) {
        cartCount.classList.remove(cartCountActiveSelector);
      }

      //есл тотал одного товара < 1, удалить карточку со страницы и со стореджа и прервать дальнейшую обработку
      if (parseInt(cardItemCount.textContent, 10) === 1) {
        event.target.closest('.cart__card').remove();
        sessionStorage.removeItem(element);
        return;
      }

      //обновление значения количества тотал ОДНОГО вида товара после нажатия на плюс на странице и в сторедже
      sessionStorage.setItem(element, parseInt(sessionStorage.getItem(element)) - 1);
      cardItemCount.textContent = sessionStorage.getItem(element);

      //обновление значения цены тотал ОДНОГО вида товара после нажатия на плюс на странице
      cardItemTotalPrice.textContent = `${(parseInt(cardItemCount.textContent, 10) * price).toLocaleString('ru-RU')}  ₽`;
    });

    //Обработчик на плюс кнопку
    cardPlusBtn.addEventListener('click', () => {
      //обновление значения тотал прайса после нажатия на плюс на странице и в сторедже
      let newTotalPrice = parseInt(sessionStorage.getItem('totalPrice'), 10) + price;
      totalPriceEl.textContent = `₽ ${newTotalPrice.toLocaleString('ru-RU')}`;
      sessionStorage.setItem('totalPrice', newTotalPrice);

      //обновление значения тотал товаров после нажатия на плюс на странице и в сторедже
      let newTotalItemsCount = parseInt(sessionStorage.getItem('totalItemsCount'), 10) + 1;
      cartCount.textContent = newTotalItemsCount;
      sessionStorage.setItem('totalItemsCount', newTotalItemsCount);

      //обновление значения количества тотал ОДНОГО вида товара после нажатия на плюс на странице и в сторедже
      sessionStorage.setItem(element, parseInt(sessionStorage.getItem(element)) + 1);
      cardItemCount.textContent = sessionStorage.getItem(element);

      //обновление значения цены тотал ОДНОГО вида товара после нажатия на плюс на странице
      cardItemTotalPrice.textContent = `${(parseInt(cardItemCount.textContent, 10) * price).toLocaleString('ru-RU')}  ₽`;
    });

    //Обработчик на удалить кнопку
    cardDeleteBtn.addEventListener('click', event => {
      //обновление значения тотал прайса после удаления карточки на странице и в сторедже
      let newTotalPrice = parseInt(sessionStorage.getItem('totalPrice'), 10) - parseInt(cardItemTotalPrice.textContent.replace(/\s/g, ''), 10);
      totalPriceEl.textContent = `₽ ${newTotalPrice.toLocaleString('ru-RU')}`;
      sessionStorage.setItem('totalPrice', newTotalPrice);

      //обновление значения тотал товаров после удаления карточки на странице и в сторедже
      let newTotalItemsCount = parseInt(sessionStorage.getItem('totalItemsCount'), 10) - parseInt(cardItemCount.textContent, 10);
      cartCount.textContent = newTotalItemsCount;
      sessionStorage.setItem('totalItemsCount', newTotalItemsCount);
      //есл тотал товаров < 1, убрать счетчик с иконки в хедере
      if (parseInt(cartCount.textContent, 10) === 0) {
        cartCount.classList.remove(cartCountActiveSelector);
      }
      //удалить карточку со стриницы
      event.target.closest('.cart__card').remove();
      //удалить карточку со стореджа
      sessionStorage.removeItem(element);
    });

    return cardElement;
  } catch (e) {
    console.log(`Catch error: ${e}`);
  }
}

function generateTemplateCard() {
  //отрисовываем тотал прайс при открытии страницы корзины
  totalPriceEl.textContent = sessionStorage.getItem('totalPrice') ? `₽ ${parseInt(sessionStorage.getItem('totalPrice'), 10).toLocaleString('ru-RU')}` : 0;
  // проходим по стореджу и передаем каждый элемент хранилища в функцию
  for (let i = 0; i < sessionStorage.length; i++) {
    const element = sessionStorage.key(i);
    const cardElement = createCardElement(element);

    //если объект вернулся, отрисуем в корзине
    if (cardElement) {
      cartItems.append(cardElement);
    }
  }
}

generateTemplateCard();
