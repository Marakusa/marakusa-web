import { useAuth } from '../context/auth';
import { Spinner } from '../components/Spinner';
import LinkText from '../components/LinkText';
import type { LicenseType } from '../interfaces/License';
import { useState, useEffect } from 'react';
import RedeemLicenseForm from '../components/RedeemLicenseForm';
import { apiFetch } from '../utils/api';

function Licenses() {
    const { user, isLoading } = useAuth();

    const [licenses, setLicenses] = useState<LicenseType[]>([]);
    const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [redeeming, setRedeeming] = useState(false);
    const [redeemError, setRedeemError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        const fetchLicenses = async () => {
            setIsLoadingLicenses(true);
            setError(null);
            try {
                setLicenses(await apiFetch<LicenseType[]>('/api/licenses', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                }));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch licenses');
            } finally {
                setIsLoadingLicenses(false);
            }
        };
        fetchLicenses();
    }, [user]);

    const redeemLicense = async (licenseKey: string) => {
        setRedeeming(true);
        setRedeemError(null);
        try {
            const data = await apiFetch<LicenseType>('/api/licenses/redeem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ license_key: licenseKey }),
            });
            setLicenses(prev => [...prev, data]);
        } catch (err) {
            setRedeemError(err instanceof Error ? err.message : 'Failed to redeem license');
        } finally {
            setRedeeming(false);
        }
    };

    return (
        <div className="text-left grow">
            <h1>Licenses</h1>
            {(isLoading || isLoadingLicenses) && <Spinner />}
            {error && <p>{error}</p>}
            {!isLoading && !isLoadingLicenses && (
                <>
                    <div className="box mb-4 p-4">
                        <RedeemLicenseForm onRedeem={redeemLicense} redeeming={redeeming} redeemError={redeemError} />
                    </div>

                    {!user ? (
                        <p>Seems like you are not logged in. Please <LinkText href="/api/auth/login">log in</LinkText> to view your licenses.</p>
                    ) : (
                        licenses?.length === 0 ? (
                            <p>No licenses found.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thumbnail</th>
                                        <th>Product</th>
                                        <th>License Key</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {licenses.map(license => (
                                    <tr key={license._id}>
                                        <td><img width="64" src={license.internal_product_id.thumbnail_url} alt={license.internal_product_id.name} /></td>
                                        <td>{license.internal_product_id.name}</td>
                                        <td>{license.license_key}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )
                    )}
                </>
            )}
        </div>
    );
}

export default Licenses;