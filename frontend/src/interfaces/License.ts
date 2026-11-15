export interface LicenseType {
    _id: string;
    license_key: string;
    internal_product_id: {
        name: string;
        thumbnail_url: string;
        jinxxy_product_url: string;
    };
    product_id: string;
}