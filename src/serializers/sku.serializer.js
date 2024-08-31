export class SkuSerializer {
    /**
     * Serialize a single SKU object.
     *
     * @param {Object} sku - The SKU object to serialize.
     * @returns {Object} Serialized SKU object.
     */
    static serialize(sku) {
        if (!sku || typeof sku !== 'object') {
            throw new Error('Invalid SKU object');
        }

        const { productName, inputImageUrl, outputImageUrl, requestId } = sku;

        return { productName, inputImageUrl, outputImageUrl, requestId };
    }

    /**
     * Serialize an array of SKU objects.
     *
     * @param {Array} skus - The array of SKU objects to serialize.
     * @returns {Array} Array of serialized SKU objects.
     */
    static serializeMany(skus) {
        if (!Array.isArray(skus)) {
            throw new Error('Expected an array of SKUs');
        }

        return skus.map(sku => this.serialize(sku));
    }
}
