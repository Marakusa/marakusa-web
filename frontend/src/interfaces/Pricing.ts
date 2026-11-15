export interface PricingType {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;

    new?: boolean;
    editing?: boolean;
    edited?: boolean;
    saving?: boolean;
}

export interface BaseType {
    _id: string;
    name: string;
    thumbnail_name: string;
    author: string;
}