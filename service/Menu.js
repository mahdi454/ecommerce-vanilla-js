import Api from './Api.js';

export async function loadData() {
  myApp.store.menu = await Api.fetchMenu();
}
export async function getProductById(id) {
  if (myApp.store.menu == null) {
    await loadData();
  }
  for (let c of myApp.store.menu) {
    for (let p of c.products) {
      if (p.id == id) {
        return p;
      }
    }
  }
  return null;
}
