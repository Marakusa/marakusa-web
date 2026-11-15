import type { ProductType } from '../interfaces/Product';
import { parseCurrency } from '../utils/currency';

function StoreProductItem({ product }: { product: ProductType }) {
    return (
        <div 
            onClick={() => window.open(product.jinxxy_product_url, '_blank')}
            className="cursor-pointer border p-4 text-left">
            <img src={product.thumbnail_url} alt="Thumbnail" className="mb-2" />
            <h2>{product.name}</h2>
            <p>{parseCurrency(product.price, product.currency)}</p>
        </div>
    );
}

export default StoreProductItem;
