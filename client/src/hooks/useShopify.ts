import { useCallback } from 'react';

// import { Product } from '../types';
import { useDispatch, actions } from '../store';

import useShopifyGraphQL from './useShopifyGraphQL';

const useShopify = () => {
  const dispatch = useDispatch();
  const { request } = useShopifyGraphQL();
  // const { shopify } = useSelector((state) => state);
  // const { products } = shopify;
  // Get pre-signed URL to upload an image to AWS S3

  const loadProducts = useCallback(async () => {
    const { response, error } = await request({
      query: `query {
        products (first: 10) {
          edges {
            node {
              id
              title
              descriptionHtml
            }
          }
        }
      }
      `
    });

    if (error) return { error };

    dispatch(
      actions.setShopifyProducts({
        shopify: [...response.body.data.products.edges]
      })
    );

    return { error, response };
  }, [request, dispatch]);

  return {
    loadProducts
  };
};

export default useShopify;
