import { loadData } from './service/Menu.js';
import Router from './service/Router.js';
import Store from './service/Store.js';
import { MenuPage } from './components/MenuPage.js';
import { ProductItem } from './components/ProductItem.js';
import { DetailsPage } from './components/DetailsPage.js';
import { OrderPage } from './components/OrderPage.js';
import { CartItem } from './components/CartItem.js';

window.myApp = {};
myApp.store = Store;
myApp.router = Router;
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  myApp.router.init();
});

window.addEventListener('myappcartchange', () => {
  const badge = document.getElementById('badge');
  const qty = myApp.store.cart.reduce((acc, item) => acc + item.quantity, 0);
  badge.textContent = qty;
  badge.hidden = qty == 0;
});
