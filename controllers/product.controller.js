import Product from "../models/product.model.js";
import AppError from "../utils/AppError.js";

import uploadToCloudinary from '../utils/uploadToCloudinary.js'

export const createProduct = async(req,res)=>{

    const { title, description, price, category, university } = req.body;

     let imageUrls = [];
        
      if (req.files && req.files.length > 0) {
        // upload all images
        imageUrls = await Promise.all(
          req.files.map(file => 
            uploadToCloudinary(file.buffer, 'student-marketplace/products')
          )
        );
      }

    

    const newProduct = await Product.create({
        title,
        description,
        price,
        category,
        university,
        seller:req.user.id,
        images: imageUrls,
    })

    res.status(201).json({
        success:true,
        data:newProduct
    });
}


export const getProducts = async(req,res)=>{

    const {category, university, page=1, limit=20} = req.query;


    const filter = {isAvaillable:true}
    if(university) filter.university = university;
    if(category) filter.category = category;

    const skip = (page-1)*limit;

        const [products, total] = await Promise.all([Product.find(filter)
                                    .populate('seller', 'fullName profilePicture')
                                    .skip(skip)
                                    .sort({createdAt:-1})
                                    .limit(Number(limit)),
                                    await Product.countDocuments(filter)

                                ])


        
    

    res.status(200).json({
        success:true,
        total,
        totalPages:Math.ceil(total/limit),
        currentPage:Number(page),
        data:products
    })


}


export const getProduct = async (req,res)=>{

    const id = req.params.id;
    const product = await Product.findById(id);

    if(!product) throw new AppError('product not found', 404);

    res.status(200).json({
        success:true,
        data:product    })
}


export const searchProduct = async (req,res)=>{
    const {query} = req.query
    if(!query) throw new AppError('no query provided',400);

    const product = await Product.find(
        { $text : { $search:query } },
        { score: {$meta: 'textScore' } } )
        .populate('seller', 'fullName profilePicture')
        .limit(20)

        res.status(200).json({
            success:true,
            data:product
        })
}

export const getMyListings = async (req,res) =>{

    const products = await Product.find( { seller: req.user.id })
                                  .sort({ createdAt:-1 });
                                  
        res.status(200).json({
            success:true,
            data:products
        })
}


export const updateProduct = async (req,res)=>{
    
    const product = await Product.findById(req.params.id);

    if(!product) throw new AppError('no product with the provided id', 404);

    const { title, description,  price, category, university} = req.body        

    if(product.seller._id.toString() !== req.user.id) throw new AppError('you are not allowed to update someone product', 403);

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {title, description, price, category, university, },
        {new:true, runValidators:true}
    );

    res.status(200).json({
        success:true,
        data:updatedProduct
    })

}


export const deleteProduct = async(req,res)=>{

    const product = await Product.findById(req.params.id);

    if(!product) throw new AppError('no product with the provided id', 404);

    if(product.seller._id.toString() !== req.user.id && req.user.role !== 'admin') throw new AppError('you are not allowed to delete this product', 403);

    await Product.deleteOne();

    res.status(200).json({
        success:true,
        message:'product deleted successfully'
    });
}