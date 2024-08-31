/**
 * Function to standardize CSV headers.
 * - Removes dots (.)
 * - Replaces spaces with underscores (_)
 * - Converts to lowercase
 *
 * @param {string} header - Original header string.
 * @returns {string} - Standardized header string.
 */
const standardizeHeader = (header) => {
    return header.replace(/\./g, '').replace(/ /g, '_').toLowerCase().trim();
};

export { standardizeHeader };