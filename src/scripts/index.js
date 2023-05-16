import { initialArray, templateCardId, headphones, headphonesWireless, cartCount, cartCountActiveSelector, totalItemsCount } from './constants.js';

//Если при загрузке страницы в session storage есть нужные объекты, отрисовываем количество на значке корзины
if (totalItemsCount > 0) {
  cartCount.classList.add(cartCountActiveSelector);
  cartCount.textContent = totalItemsCount;
}

//создаем элемент карточки
function createCardElement(element) {
  const { img, title, price, oldPrice, rate } = element;
  const cardElement = document.querySelector(templateCardId).content.querySelector('.card').cloneNode(true);
  const cardElementImg = cardElement.querySelector('.card__img');
  const cardElementTitle = cardElement.querySelector('.card__title');
  const cardElementPriceCurrent = cardElement.querySelector('.card__price-current');
  const cardElementPriceOld = cardElement.querySelector('.card__price-old');
  const cardElementRate = cardElement.querySelector('.card__raiting-score');
  const cardElementBuyBtn = cardElement.querySelector('.card__buy-btn');

  cardElementImg.src = img;
  cardElementImg.alt = title;
  cardElementTitle.textContent = title;
  cardElementPriceCurrent.textContent = `${price.toLocaleString('ru-RU')} ₽`;
  cardElementPriceOld.textContent = oldPrice ? `${oldPrice.toLocaleString('ru-RU')} ₽` : '';
  cardElementRate.textContent = rate;

  //Добавляем слушатель на кнопку "Купить"
  cardElementBuyBtn.addEventListener('click', event => {
    event.preventDefault();
    handleBuyButtonClick(element);
  });

  return cardElement;
}

//обработчик клика на "Купить"
function handleBuyButtonClick(element) {
  //Добавляем элемент в корзину
  addToCart(element);

  //при клике на кнопку обновляем общий счетчик товаров в корзине
  cartCount.textContent = JSON.parse(sessionStorage.getItem('totalCounts')).totalQuantity;

  //если корзина ранее была пуста, отрисовываем круг с цифрой количества на иконке в хедере
  if (!cartCount.classList.contains(cartCountActiveSelector)) {
    cartCount.classList.add(cartCountActiveSelector);
  }
}

//Добавление элемента в хранилище
function addToCart(element) {
  const cartString = sessionStorage.getItem('cart');
  let cart = [];

  // Если массив "cart" уже существует в sessionStorage, преобразуем его из строки JSON в JavaScript-объекn
  if (cartString) {
    cart = JSON.parse(cartString);
  }
  // Поиск объекта в массиве "cart"
  const existingObject = cart.find(obj => obj.id === element.id);

  if (existingObject) {
    // Если объект уже существует, добавляем поле "count"
    existingObject.count = existingObject.count ? existingObject.count + 1 : 1;
  } else {
    // Если объект не найден, добавляем новый объект с полем "count"
    element.count = 1;
    cart.push(element);
  }

  // Преобразование обновленного массива "cart" обратно в строку JSON
  const updatedCartString = JSON.stringify(cart);
  // Сохранение обновленной строки JSON в sessionStorage
  sessionStorage.setItem('cart', updatedCartString);

  //Обновляем глобальные счетчики
  updateTotalCounts(element);
}

//Функция, отвечающая за обновление счетчика общего кол-во товаров и итоговой цены
function updateTotalCounts(element) {
  const totalCountsString = sessionStorage.getItem('totalCounts');
  let totalCounts = { totalQuantity: 1, totalPrice: element.price };

  // Если массив "totalCounts" уже существует в sessionStorage, преобразуем его из строки JSON в JavaScript-объекn
  if (totalCountsString) {
    totalCounts = JSON.parse(totalCountsString);
    totalCounts.totalQuantity += 1;
    totalCounts.totalPrice += element.price;
  }

  // Преобразование обновленного массива "totalCounts" обратно в строку JSON
  const updatedtotalCountsString = JSON.stringify(totalCounts);
  // Сохранение обновленной строки JSON в sessionStorage
  sessionStorage.setItem('totalCounts', updatedtotalCountsString);
}

//отрисовка карточки
function generateTemplateCard() {
  // проходим по массиву изначально заданных данных
  initialArray.forEach(element => {
    const cardElement = createCardElement(element);

    //Если наушники проводные, рисуем в одном блоке, если нет, в другом
    if (element.isWireless === false) {
      headphones.append(cardElement);
    } else {
      headphonesWireless.append(cardElement);
    }
  });
}

generateTemplateCard();
