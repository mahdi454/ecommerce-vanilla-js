import { defaultSort } from '../lib/constants.js';
import { getCollectionProducts } from '../shopify/index.js';

export async function featuredData() {
  const { sortKey, reverse } = defaultSort;
  const products = await getCollectionProducts({
    collection: 'featured',
    sortKey,
    reverse,
  });

  if (!products) return null;
  return products;
}
