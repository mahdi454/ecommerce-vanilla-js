const Router = {
  init: () => {
    document.querySelectorAll('a.navlink').forEach((a) => {
      a.addEventListener('click', (event) => {
        event.preventDefault();
        let url = event.target.getAttribute('href');
        Router.go(url);
      });
    });
    window.addEventListener('popstate', (event) => {
      Router.go(event.state.route, false);
      console.log(event.state.route);
    });
  },
  go: (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ route }, '', route);
    }
    let pageEl = null;
    switch (route) {
      case '/':
        pageEl = document.createElement('menu-page');

        break;
      case '/order':
        pageEl = document.createElement('order-page');
        break;

      default:
        if (route.startsWith('/product-')) {
          console.log('I am going to ...');
          pageEl = document.createElement('details-page');
          pageEl.dataset.id = route.substring(route.lastIndexOf('-') + 1);
        }

        break;
    }
    // document.querySelector('main').children[0].remove();
    if (pageEl) {
      document.querySelector('main').innerHTML = '';
      document.querySelector('main').appendChild(pageEl);
    }
    window.scrollX = 0;
    window.scrollY = 0;
  },
};

export default Router;
