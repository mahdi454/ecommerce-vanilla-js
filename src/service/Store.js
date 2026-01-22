const Store = {
  featuredData: [],
  cart: [],
};

const proxyStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    if (property == 'featuredData') {
      window.dispatchEvent(new Event('appfeaturedDatachange'));
    }
    if (property == 'cart') {
      window.dispatchEvent(new Event('myappcartchange'));
    }

    return true;
  },
});

export default proxyStore;
