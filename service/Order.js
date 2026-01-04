import { getProductById } from './Menu.js';

export async function addToCart(id) {
  const product = await getProductById(id);
  const results = myApp.store.cart.filter((proInCart) => proInCart.product.id == id);

  if (results.length == 1) {
    myApp.store.cart = myApp.store.cart.map((p) =>
      p.product.id == id ? { ...p, quantity: p.quantity + 1 } : p
    );
  } else {
    myApp.store.cart = [...myApp.store.cart, { product, quantity: 1 }];
  }
}

export function removeFromCart(id) {
  myApp.store.cart = myApp.store.cart.filter((prodInCart) => prodInCart.product.id != id);
}
