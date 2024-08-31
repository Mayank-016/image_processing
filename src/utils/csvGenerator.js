import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';

/**
 * Generates a CSV file from an array of data.
 *
 * @param {Array} data - Array of objects to be written to the CSV file.
 * @param {string} filePath - Path to save the CSV file.
 * @returns {Promise<void>}
 */
export const generateCsv = async (data, filePath) => {
    // Create CSV writer instance
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'sno', title: 'SNO' },
            { id: 'productName', title: 'Product Name' },
            { id: 'inputImageUrl', title: 'Input Image URL' },
            { id: 'outputImageUrl', title: 'Output Image URL' }
        ]
    });

    // Write data to the CSV file
    try {
        await csvWriter.writeRecords(data);
        console.log('CSV file generated successfully at:', filePath);
    } catch (error) {
        console.error('Error generating CSV file:', error);
        throw error; // Rethrow error for proper error handling
    }
};
