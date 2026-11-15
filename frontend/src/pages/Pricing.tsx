import { useState, useEffect } from 'react';
import { Spinner } from '../components/Spinner';
import type { PricingType } from '../interfaces/Pricing';

const Pricing = () => {
    const [pricing, setPricing] = useState<PricingType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const response = await fetch('/api/pricings');
                if (!response.ok) {
                    throw new Error('Failed to fetch pricing');
                }
                const data = await response.json();
                setPricing(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPricing();
    }, []);

    return (
        <div className="grow flex flex-col gap-4">
            {isLoading && <Spinner />}
            {
                error ? <div>{error}</div> : 
                pricing.length === 0 ? (
                    <div>No pricing available</div>
                ) : (
                <>
                    <h1 className="text-left">Commission Pricing</h1>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 text-left">
                        {pricing.map((pricing) => (
                            <div key={pricing._id} className="border">
                                {pricing.image && <img src={'/images/' + pricing.image} alt={pricing.name} className="mt-2" />}
                                <div className="p-3">
                                    <h2 className="text-lg font-bold">{pricing.name}</h2>
                                    <p className="text-sm">{pricing.description}</p>
                                    <p className="font-bold">${pricing.price}+</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                )
            }
        </div>
    );
};

export default Pricing;