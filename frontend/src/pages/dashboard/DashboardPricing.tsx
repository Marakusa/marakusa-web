import { Spinner } from '../../components/Spinner';
import { useState, useEffect } from 'react';
import type { PricingType } from '../../interfaces/Pricing';
import Button from '../../components/Button';

const DashboardPricing = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pricing, setPricing] = useState<PricingType[]>([]);

    useEffect(() => {
        const fetchPricings = async () => {
            try {
                const response = await fetch('/api/pricings');
                if (!response.ok) {
                    throw new Error('Failed to fetch pricing data');
                }
                const data: PricingType[] = await response.json();

                // Make sure the items are set as not editing and not edited by default
                data.forEach(item => {
                    if (item.editing === undefined) item.editing = false;
                    if (item.edited === undefined) item.edited = false;
                });

                setPricing(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch pricing data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPricings();
    }, []);

    const handleNewPricing = () => {
        setPricing((prev) => [
            ...prev,
            {
                _id: Date.now().toString(),
                name: 'New Pricing',
                price: 0,
                editing: true,
                edited: false,
                new: true,
            },
        ]);
    };

    const saveEditsOrCreate = async (id: string) => {
        setPricing((prev) =>
            prev.map((p) =>
                p._id === id ? { ...p, saving: true } : p
            )
        );
        try {
            const itemToSave = pricing.find(p => p._id === id);

            if (!itemToSave) throw new Error('Item not found');

            const url = itemToSave.new ? '/api/pricings' : `/api/pricings/${id}`;
            const method = itemToSave.new ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: itemToSave.name,
                    price: itemToSave.price,
                    description: itemToSave.description,
                    image: itemToSave.image,
                }),
            });
            if (!response.ok) throw new Error('Failed to save pricing');
            const updatedItem: PricingType = await response.json();
            setPricing((prev) =>
                prev.map((p) =>
                    p._id === id ? { ...updatedItem, editing: false, edited: true, saving: false, new: false } : p
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save pricing');
            setPricing((prev) =>
                prev.map((p) =>
                    p._id === id ? { ...p, saving: false } : p
                )
            );
        }
    };

    const deletePricing = async (id: string) => {
        setPricing((prev) =>
            prev.map((p) =>
                p._id === id ? { ...p, saving: true } : p
            )
        );
        try {
            const response = await fetch(`/api/pricings/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (!response.ok) throw new Error('Failed to delete pricing');
            setPricing((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete pricing');
            setPricing((prev) =>
                prev.map((p) =>
                    p._id === id ? { ...p, saving: false } : p
                )
            );
        }
    };

    if (isLoading) {
        return <div className="grow"><Spinner /></div>;
    }
    if (error) {
        return <div className="grow"><p>{error}</p></div>;
    }

    return (
        <div className="text-left grow flex flex-col w-full gap-3">
            <div className="flex justify-between items-center">
                <h2>Commission Pricing</h2>
                <Button onClick={handleNewPricing}>
                    New +
                </Button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price (USD)</th>
                        <th>Notes</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {pricing.length === 0 && <p>No pricing available</p>}
                <tbody>
                    {pricing.map((item) => 
                    item.editing ? (
                        <tr key={item._id}>
                            <td>
                                <input
                                    type="text"
                                    value={item.name}
                                    disabled={item.saving}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        setPricing((prev) =>
                                            prev.map((p) =>
                                                p._id === item._id ? { ...p, name: newName } : p
                                            )
                                        );
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.price}
                                    disabled={item.saving}
                                    onChange={(e) => {
                                        const newPrice = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                        setPricing((prev) =>
                                            prev.map((p) =>
                                                p._id === item._id ? { ...p, price: newPrice } : p
                                            )
                                        );
                                    }}
                                />
                            </td>
                            <td>
                                <textarea
                                    rows={3}
                                    value={item.description || ''}
                                    disabled={item.saving}
                                    onChange={(e) => {
                                        const newDescription = e.target.value;
                                        setPricing((prev) =>
                                            prev.map((p) =>
                                                p._id === item._id ? { ...p, description: newDescription } : p
                                            )
                                        );
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={item.image || ''}
                                    disabled={item.saving}
                                    onChange={(e) => {
                                        const newImage = e.target.value;
                                        setPricing((prev) =>
                                            prev.map((p) =>
                                                p._id === item._id ? { ...p, image: newImage } : p
                                            )
                                        );
                                    }}
                                />
                            </td>
                            <td>
                                {item.saving ? <Spinner /> : 
                                <button className="text-button" disabled={item.saving} onClick={() => saveEditsOrCreate(item._id)}>Save</button>}
                            </td>
                        </tr>
                    ) : (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>${item.price}+</td>
                            <td>{item.description && <p>{item.description}</p>}</td>
                            <td>{item.image && <img src={'/images/' + item.image} alt={item.name} className="mt-2" width="64" />}</td>
                            <td>
                                {item.saving ? <Spinner /> : (
                                    <>
                                        <button className="text-button" disabled={item.saving} onClick={() => {
                                            setPricing((prev) =>
                                                prev.map((p) =>
                                                    p._id === item._id ? { ...p, editing: true } : p
                                                )
                                            );
                                        }}>Edit</button>
                                        <button className="text-button" disabled={item.saving} onClick={() => deletePricing(item._id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardPricing;