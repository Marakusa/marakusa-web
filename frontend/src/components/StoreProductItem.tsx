import type { ProductType } from '../interfaces/Product';
import { parseCurrency } from '../utils/currency';

function StoreProductItem({ product }: { product: ProductType }) {
    return (
        <div 
            onClick={() => window.open(product.jinxxy_product_url, '_blank')}
            className="cursor-pointer box bg-(--bg-2) text-left hover:underline">
            <img src={product.thumbnail_url} alt="Thumbnail" className="mb-2" />
            <div className="px-3 py-1 pb-3">
                <h2>{product.name}</h2>
                <p>{parseCurrency(product.price, product.currency)}</p>
            </div>
        </div>
    );
}

export default StoreProductItem;
