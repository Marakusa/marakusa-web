import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import type { ProductType } from '../../interfaces/Product';
import { parseCurrency } from '../../utils/currency';
import { Spinner } from '../../components/Spinner';
import Button from '../../components/Button';

const DashboardProduct: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    
    const [product, setProduct] = useState<ProductType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const thumbnailInput = useRef<HTMLInputElement>(null);
    
    const chooseAndUploadThumbnail = async (file: File) => {
        if (!productId || isUploading) return;

        setUploadError(null);
        setIsUploading(true);
        try {
            const body = new FormData();
            body.append('thumbnail', file);
            const response = await fetch(`/api/store/products/${productId}/thumbnail`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to upload thumbnail');
            setProduct(current => current ? { ...current, thumbnail_url: result.thumbnail_url } : current);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Failed to upload thumbnail');
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await fetch(`/api/store/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => res.json());
                setProduct(productData);
            } catch (err) {
                setError('Failed to fetch product');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (isLoading) {
        return <div className="grow"><Spinner /></div>;
    }
    if (error) {
        return <div className="grow"><p>{error}</p></div>;
    }
    if (!product) {
        return <div className="grow"><p>Product not found</p></div>;
    }

    return (
        <div className="text-left grow flex flex-row w-full">
            <div className="flex-1 flex flex-col gap-4">
                <div>
                    <div className="flex flex-row gap-2 items-center">
                        <h2>{product.name}</h2>
                        <p className="uppercase px-3">{product.visible ? 'Published' : 'Unpublished'}</p>
                    </div>
                    <p>{product.jinxxy_product_id}</p>
                </div>
                <p>No content so far</p>
            </div>
            <div className="flex-1 flex flex-col max-w-70">
                {product.thumbnail_url && <img src={product.thumbnail_url} alt={`${product.name} thumbnail`} className="mb-4" />}
                <input
                    ref={thumbnailInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={event => {
                        const file = event.target.files?.[0];
                        event.target.value = '';
                        if (file) void chooseAndUploadThumbnail(file);
                    }}
                />
                <Button className="mb-4" onClick={() => { if (!isUploading) thumbnailInput.current?.click(); }}>
                    {isUploading ? 'Uploading...' : 'Upload a Thumbnail'}
                </Button>
                {uploadError && <p role="alert" className="mb-4">{uploadError}</p>}
                <h2>{product.name}</h2>
                <p className="text-lg font-bold">{parseCurrency(product.price, product.currency)}</p>
                <p>Category: {product.category.toUpperCase()}</p>
            </div>
        </div>
    );
};

export default DashboardProduct;