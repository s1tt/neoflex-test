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
  cardElementPriceCurrent.textContent = `${price} ₽`;
  cardElementPriceOld.textContent = oldPrice;
  cardElementRate.textContent = rate;

  function handleBuyButtonClick(element) {
    //увеличиваем тотал прайс в сторадже при клике на купить
    sessionStorage.setItem('totalPrice', parseInt(sessionStorage.getItem('totalPrice'), 10) + price);

    //количество одного товара в корзине
    let count = sessionStorage.getItem(JSON.stringify(element)) ?? 0;

    //при клике на кнопку увеличиваем общий счетчик товаров в корзине
    sessionStorage.setItem('totalItemsCount', parseInt(sessionStorage.getItem('totalItemsCount'), 10) + 1 || 1);

    //если корзина ранее была пуста, отрисовываем значек количества на иконке в хедере
    if (!cartCount.classList.contains(cartCountActiveSelector)) {
      cartCount.classList.add(cartCountActiveSelector);
    }

    //счетчик количества на конкретный товар
    sessionStorage.setItem(JSON.stringify(element), ++count);
    cartCount.textContent = sessionStorage.getItem('totalItemsCount');
  }

  cardElementBuyBtn.addEventListener('click', event => {
    event.preventDefault();
    handleBuyButtonClick(element);
  });

  return cardElement;
}

//отрисовка карточки
function generateTemplateCard() {
  //если тотал прайс нет, создаем его в локал стораже
  if (!sessionStorage.getItem('totalPrice')) sessionStorage.setItem('totalPrice', 0);
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
