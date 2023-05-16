const initialArray = [
  {
    id: 1,
    title: 'Apple BYZ S852I',
    img: './images/headphone1.png',
    price: 2927,
    oldPrice: 3527,
    rate: 4.7,
    isWireless: false
  },
  {
    id: 2,
    title: 'Apple EarPods',
    img: './images/headphone2.png',
    price: 2327,
    rate: 4.5,
    isWireless: false
  },
  {
    id: 3,
    title: 'Apple EarPods',
    img: './images/headphone3.png',
    price: 2327,
    rate: 4.5,
    isWireless: false
  },
  {
    id: 4,
    title: 'Apple BYZ S852I',
    img: './images/headphone1.png',
    price: 2927,
    rate: 4.7,
    isWireless: false
  },
  {
    id: 5,
    title: 'Apple EarPods',
    img: './images/headphone2.png',
    price: 2327,
    rate: 4.5,
    isWireless: false
  },
  {
    id: 6,
    title: 'Apple EarPods',
    img: './images/headphone3.png',
    price: 2327,
    rate: 4.5,
    isWireless: false
  },
  {
    id: 7,
    title: 'Apple AirPods',
    img: './images/headphone-wireless1.png',
    price: 9527,
    rate: 4.7,
    isWireless: true
  },
  {
    id: 8,
    title: 'GERLAX GH-04',
    img: './images/headphone-wireless2.png',
    price: 6527,
    rate: 4.7,
    isWireless: true
  },
  {
    id: 9,
    title: 'BOROFONE BO4',
    img: './images/headphone-wireless3.png',
    price: 7527,
    rate: 4.7,
    isWireless: true
  }
];

const totalItemsCount = sessionStorage.getItem('totalCounts') ? JSON.parse(sessionStorage.getItem('totalCounts')).totalQuantity : 0;

const templateCardId = '#card';

const headphones = document.querySelector('.headphones__items');
const headphonesWireless = document.querySelector('.wireless-headphones__items');
const cartCount = document.querySelector('.cart-count');
const cartCountActiveSelector = 'header__shop-count_active';

const cartItems = document.querySelector('.cart__items');
const templateCardIdFromCart = '#cart__card';
const totalPriceEl = document.querySelector('.cart__checkout-total-price');

export { initialArray, templateCardId, headphones, headphonesWireless, cartCount, cartCountActiveSelector, cartItems, templateCardIdFromCart, totalPriceEl, totalItemsCount };
