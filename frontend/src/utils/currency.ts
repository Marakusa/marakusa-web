export const parseCurrency = (price: number, currency: string) => {
    const formattedPrice = (price / 100).toFixed(2);
    switch (currency) {
        case 'USD':
            return `${formattedPrice} USD`;
        case 'EUR':
            return `${formattedPrice}€`;
        case 'GBP':
            return `£${formattedPrice}`;
        default:
            return `${formattedPrice} ${currency}`;
    }
};