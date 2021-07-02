import React, { FC } from 'react';
import { ProductType } from '../types/productTypes';

const Product: FC<{ product: ProductType }> = ({ product }) => {
  return (
    <div className="Recipe">
      <div className="image-placeholder">
        <div className="creator">
          <label>{product.id}</label>
          <label>{product.title}</label>
          <label>{product.descriptionHtml}</label>
        </div>
      </div>
    </div>
  );
};

export default Product;
