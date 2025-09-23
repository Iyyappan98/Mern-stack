const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "please enter product description"]
    },
    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "please enter product category"],
        enum: {
            values: [
               'Electronics',
               'Mobile Phones',
               'Laptops',
               'Accessories',
               'Headphones',
               'Food',
               'Books',
               'Clothes,Shoes',
               'Beauty/Health',
               'Sports',
               'Outdoor',
               'Home'
            ],
            message: "please select corect category"
     }
    },
    seller: {
        type: String,
        required: [true, "please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "please enter product stock"],
        maxLength: [20,"product stock cannot exceed 20"]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now
    }  
    
    
})

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;