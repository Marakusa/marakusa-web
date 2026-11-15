import { useState, useEffect } from 'react';
import type { ProductType } from '../interfaces/Product';
import { Spinner } from '../components/Spinner';
import StoreProductItem from '../components/StoreProductItem';

function Store() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/store/products');
                if (!response.ok) throw new Error('Failed to fetch products. Please try again later.');
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="grow flex flex-col gap-4">
            {isLoading && <Spinner />}
            {
                error ? <div>{error}</div> : 
                products.length === 0 ? (
                <div>No products available</div>
                ) : (
                <>
                    <h1 className="text-left">Avatars</h1>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {products.filter(product => product.category === 'avatars').map((product) => (
                            <StoreProductItem key={product._id} product={product} />
                        ))}
                    </div>

                    <h1 className="text-left">Accessories</h1>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {products.filter(product => product.category !== 'avatars').map((product) => (
                            <StoreProductItem key={product._id} product={product} />
                        ))}
                    </div>
                </>
                )
            }
        </div>
    );
}

export default Store;