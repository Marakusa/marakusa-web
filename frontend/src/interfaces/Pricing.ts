export interface PricingType {
    _id: string;
    name: string;
    price: number;
    description?: string;

    new?: boolean;
    editing?: boolean;
    edited?: boolean;
    saving?: boolean;
}