import express from 'express';
import { createProduct, deleteProduct, getMyListings, getProduct, getProducts, searchProduct, updateProduct } from '../controllers/product.controller.js';
import {verify} from '../middlewares/secure.js'
import validate from '../middlewares/validate.js';
import { createProductSchema } from '../validators/product.validator.js';
import upload from '../config/multer.js'

const router = express.Router();

router.get('/search', searchProduct);
router.get('/listenings', verify, getMyListings);


router.post('/', verify,upload.array('images', 5),validate(createProductSchema),createProduct);
router.get('/',getProducts);
router.get('/:id', getProduct);
router.put('/:id', verify,updateProduct);
router.delete('/:id', verify, deleteProduct);

export default router;