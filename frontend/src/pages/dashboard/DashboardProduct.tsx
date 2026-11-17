import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ProductType } from '../../interfaces/Product';
import { parseCurrency } from '../../utils/currency';
import { Spinner } from '../../components/Spinner';
import Button from '../../components/Button';
import { apiFetch } from '../../utils/api';

interface ThumbnailUploadResponse {
    thumbnail_url: string;
}

const DashboardProduct: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    
    const [product, setProduct] = useState<ProductType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const thumbnailInput = useRef<HTMLInputElement>(null);

    const [editDiscordRole, setEditDiscordRole] = useState(false);
    const [discordRoleInput, setDiscordRoleInput] = useState(product?.discord_role_name ?? '');
    const [discordRoleError, setDiscordRoleError] = useState<string | null>(null);
    const [isSavingDiscordRole, setIsSavingDiscordRole] = useState(false);
    const toggleEditDiscordRole = () => {
        setEditDiscordRole(!editDiscordRole);
    };
    const saveDiscordRole = async (newRole: string) => {
        if (!productId) return;

        try {
            setIsSavingDiscordRole(true);
            const body = JSON.stringify({ discord_role_name: newRole });
            const result = await apiFetch<ProductType>(`/api/store/products/${productId}/discord-role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body
            });
            setProduct(result);
            setEditDiscordRole(false);
        } catch (error) {
            console.error(error);
            setDiscordRoleError(error instanceof Error ? error.message : 'Failed to update Discord role');
        } finally {
            setIsSavingDiscordRole(false);
        }
    };
    
    const chooseAndUploadThumbnail = async (file: File) => {
        if (!productId || isUploading) return;

        setUploadError(null);
        setIsUploading(true);
        try {
            const body = new FormData();
            body.append('thumbnail', file);
            const result = await apiFetch<ThumbnailUploadResponse>(`/api/store/products/${productId}/thumbnail`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body,
            });
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
                const productData = await apiFetch<ProductType>(`/api/store/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProduct(productData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch product');
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
                    <Link to="/dashboard/products" className="underline">
                        &larr; Return to products
                    </Link>
                    <div className="flex flex-row gap-2 items-center mt-2">
                        <h2>{product.name}</h2>
                        <p className="uppercase px-3">{product.visible ? 'Published' : 'Unpublished'}</p>
                    </div>
                    <p>{product.jinxxy_product_id}</p>
                </div>
                <div className="box p-3 flex flex-col gap-1 w-min min-w-100">
                    <div className="flex flex-row gap-2 items-center font-bold"><p>Discord Role</p>{isSavingDiscordRole && <Spinner />}</div>

                    {editDiscordRole ? (
                        <>
                            <input
                                type="text"
                                value={discordRoleInput}
                                onChange={e => setDiscordRoleInput(e.target.value)}
                                maxLength={95}
                                className="border p-1"
                            />
                            <Button onClick={async () => await saveDiscordRole(discordRoleInput)} disabled={isSavingDiscordRole}>
                                Save
                            </Button>
                            <Button onClick={toggleEditDiscordRole} disabled={isSavingDiscordRole}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <p>{product.discord_role_name ?? 'not set (defaulting to product name)'}</p>
                            <Button onClick={toggleEditDiscordRole}>
                                Edit
                            </Button>
                        </>
                    )}
                    {discordRoleError && <p role="alert" className="text-red-500">{discordRoleError}</p>}
                    
                </div>
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
                {uploadError && <p role="alert" className="mb-4 text-red-500">{uploadError}</p>}
                <h2>{product.name}</h2>
                <p className="text-lg font-bold">{parseCurrency(product.price, product.currency)}</p>
                <p>Category: {product.category.toUpperCase()}</p>
            </div>
        </div>
    );
};

export default DashboardProduct;