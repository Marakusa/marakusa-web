import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductType } from '../../interfaces/Product';
import { parseCurrency } from '../../utils/currency';
import { Spinner } from '../../components/Spinner';

const DashboardProducts: React.FC = () => {
    const navigate = useNavigate();
    
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await fetch('/api/store/products', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => res.json());
                setProducts(productsData);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="text-left grow">
            <h2>Products</h2>
            {isLoading ? (
                <Spinner />
            ) : error ? (
                <p>{error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>URL</th>
                            <th>Visible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} onClick={() => navigate(`/dashboard/products/${product._id}`)}>
                                <td><img src={product.thumbnail_url} width="50" height="50" /></td>
                                <td>{product.jinxxy_product_id}</td>
                                <td>{product.name}</td>
                                <td>{parseCurrency(product.price, product.currency)}</td>
                                <td>{product.category}</td>
                                <td><a href={product.jinxxy_product_url} target="_blank" rel="noopener noreferrer">Link</a></td>
                                <td>{product.visible ? 'Published' : 'Unpublished'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashboardProducts;