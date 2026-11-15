import { useState } from 'react';
import { Spinner } from './Spinner';

interface RedeemLicenseFormProps {
    onRedeem: (licenseKey: string) => void;
    redeeming: boolean;
    redeemError: string | null;
}

function RedeemLicenseForm({ onRedeem, redeeming, redeemError }: RedeemLicenseFormProps) {
    const [licenseKey, setLicenseKey] = useState('');

    return (
        <form className="flex flex-col gap-2" onSubmit={(e) => {
            e.preventDefault();
            onRedeem(licenseKey);
            setLicenseKey('');
        }}>
            <div className="flex gap-2">
                <input
                    className="grow"
                    type="text"
                    value={licenseKey}
                    disabled={redeeming}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="Enter license key"
                />
                <button className="btn min-w-1/4" type="submit" disabled={redeeming}>Redeem</button>
            </div>
            {redeemError && <p>{redeemError}</p> }
            {redeeming && <Spinner />}
        </form>
    );
}

export default RedeemLicenseForm;