import { shopifyCache } from '../cache/cache.js';
import { SHOPIFY_DOMAIN, SHOPIFY_GRAPHQL_API_ENDPOINT, STOREFRONT_TOKEN } from '../config.js';
import { getCollectionProductsQuery } from '../lib/shopify/queries/collection.js';
import { removeEdgesAndNodes, reshapeProducts } from './helperFunc.js';

const domain = SHOPIFY_DOMAIN;
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = STOREFRONT_TOKEN;

export async function shopifyFetch({ headers, query, variables }) {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

export async function getCollectionProducts({ collection, reverse, sortKey }) {
  const cacheKey = JSON.stringify({
    collection,
    reverse,
    sortKey,
  });

  if (shopifyCache.has(cacheKey)) {
    return shopifyCache.get(cacheKey);
  }

  const res = await shopifyFetch({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  const products = reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));

  shopifyCache.set(cacheKey, products);
  return products;
}
