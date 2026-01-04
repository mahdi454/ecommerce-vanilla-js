const Api = {
  url: '/data/menu.json',
  fetchMenu: async () => {
    const req = await fetch(Api.url);
    return await req.json();
  },
};
export default Api;
