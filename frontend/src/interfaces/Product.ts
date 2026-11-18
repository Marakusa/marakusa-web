export interface ProductType {
    _id: string;
    jinxxy_product_id: string;
    name: string;
    price: number;
    currency: string;
    category: string;
    jinxxy_product_url: string;
    thumbnail_url?: string;
    visible: boolean;
    discord_role_name?: string;
}