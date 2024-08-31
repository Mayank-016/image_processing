import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { ROUTES } from '../constants/route-paths.js';
import { getSku, uploadSku } from '../controllers/sku.controller.js';
import { csvValidator } from '../middlewares/csvValidator.middleware.js';
import { skuDataTransformer } from '../middlewares/skuDataTransformer.middleware.js';


const router = Router();

router.route(ROUTES.UPLOAD_SKU)
    .post(
        upload.fields([
            { name: 'csv', maxCount: 1 },
        ]),
        csvValidator, // CSV validator middleware to check for valid CSV
        skuDataTransformer, // Middleware to validate and transform SKU data
        uploadSku // Controller function to handle further processing
    );

router.route(ROUTES.GET_SKU)
    .get(
        getSku
    );

export { router as apiRouter, ROUTES };
