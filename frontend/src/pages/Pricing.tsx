import { useState, useEffect } from 'react';
import { Spinner } from '../components/Spinner';
import LinkText from '../components/LinkText';
import type { BaseType, PricingType } from '../interfaces/Pricing';
import Button from '../components/Button';

const Pricing = () => {
    const [pricing, setPricing] = useState<PricingType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bases, setBases] = useState<BaseType[]>([]);
    const [basesLoading, setBasesLoading] = useState(true);
    const [basesError, setBasesError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const response = await fetch('/api/pricings');
                if (!response.ok) {
                    throw new Error('Failed to fetch pricing');
                }
                const data = await response.json();
                setPricing(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch pricing');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPricing();
    }, []);

    useEffect(() => {
        const fetchBases = async () => {
            try {
                const response = await fetch('/api/pricings/bases');
                if (!response.ok) throw new Error('Failed to fetch avatar bases');
                setBases(await response.json());
            } catch {
                setBasesError('Failed to load avatar bases. Please try again later.');
            } finally {
                setBasesLoading(false);
            }
        };
        fetchBases();
    }, []);

    return (
        <div className="grow flex flex-col gap-4">
            <h1 className="text-left">Commission Pricing</h1>

            {isLoading && <Spinner />}
            {
                error ? <div>{error}</div> : 

                !isLoading && pricing.length === 0 ? (
                    <div>No pricing available</div>
                ) : (

                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 text-left">
                        {pricing.map((pricing) => (
                            <div key={pricing._id} className="box bg-(--card-bg)">
                                {pricing.image && <img src={'/images/' + pricing.image} alt={pricing.name} className="bg-black/50" />}
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

            <p className="text-center text-sm">Prices may vary depending on the complexity of the request.</p>

            <section className="box text-center p-8 flex flex-col gap-4">
                <h2>Contact Me</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
                    <Button onClick={() => window.open("https://x.com/Marakusa_", "_blank")}>Twitter</Button>
                    <Button onClick={() => window.open("https://discord.com/invite/47SrTE3Spw", "_blank")}>Discord</Button>
                    <Button onClick={() => window.open("https://t.me/MaraOwO", "_blank")}>Telegram</Button>
                    <Button onClick={() => window.open("https://trello.com/b/qXrzTvLH", "_blank")}>Commission Board</Button>
                </div>
                <p className="text-sm">Terms of service apply. By commissioning me, you agree to the <LinkText href="/tos">terms of service</LinkText>.</p>
            </section>

            <section className="text-left mt-8 flex flex-col gap-4">
                <h2>What Avatar Bases can you commission?</h2>
                <p>These are the available avatar bases for commissions. If you don't see the one you want, feel free to DM me about it!</p>
                {basesLoading ? <Spinner /> : basesError ? <p role="alert">{basesError}</p> : bases.length === 0 ? (
                    <p>No avatar bases available.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {bases.map(base => (
                            <div key={base._id} className="box bg-(--bg-2)">
                                <img src={`/avatar_bases/${base.thumbnail_name}.jpeg`} alt={base.name} loading="lazy" className="w-full aspect-square object-cover bg-black/50" />
                                <div className="p-3">
                                    <h3 className="font-bold">{base.name}</h3>
                                    <p className="text-sm">by {base.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <p>Didn't find what you were looking for? Feel free to reach out and we can discuss options!</p>
            </section>
        </div>
    );
};

export default Pricing;