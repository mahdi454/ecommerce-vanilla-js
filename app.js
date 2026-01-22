import { featuredData } from './src/service/loadData.js';
import Store from './src/service/Store.js';
window.app = {};
app.store = Store;
window.addEventListener('DOMContentLoaded', async () => {
  // await featuredData();
});
