import mongoose from 'mongoose';

const productSchema =  new mongoose.Schema({
    title:{
        type:String,
        required:[true,'product name is required'],
        trim:true
    },

    description:{
        type:String,
    },
    price:{
        type:Number,
        required:[true,'price is required']
    },
    category:{
        type:String,
        required:[true,'category is required']
    },

    university:{
        type:String,
        required:[true,'university is required']
    },

    isAvaillable:{
        type:Boolean,
        default:true
    },

    images: {
      type: [String],
      default: [],
    },

    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
},
{timestamps:true} )

//enables searching by description and title
productSchema.index({
    title:"text",
    description:"text"
})

export default mongoose.model("Product", productSchema)