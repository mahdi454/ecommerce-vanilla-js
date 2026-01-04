const Store = {
  menu: null,
  cart: [],
};

const proxyStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    if (property == 'menu') {
      window.dispatchEvent(new Event('myappmenuchange'));
    }
    if (property == 'cart') {
      window.dispatchEvent(new Event('myappcartchange'));
    }

    return true;
  },
});

export default proxyStore;
