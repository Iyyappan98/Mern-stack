const catchAsyncError = require("../middlewares/catchAsyncError");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

//Create new order - http://localhost:8000/api/v1/order/new

exports.newOrder = catchAsyncError(async (req,res,next) => {

    const {orderItems,shippingInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paymentInfo}  = req.body
    const order = await orderModel.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    });
    res.status(200).json({
        success: true,
        order
    })
})

//Get single order - http://localhost:8000/api/v1/order/:id

exports.getSingleOrder = catchAsyncError(async (req,res,next) => {
    const id = req.params.id;
    const order = await orderModel.findById(id).populate('user','name email');

    if(!order) {
        return next(new ErrorHandler(`Order not found with this id ${id}`,404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//Get Loggedin User orders (all orders geting in user) - http://localhost:8000/api/v1/myOrders

exports.myOrders = catchAsyncError(async (req,res,next) => {
    const orders = await orderModel.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
})

//Admin - Get all orders

exports.getAllOrders = catchAsyncError(async (req,res,next) => {
    const orders = await orderModel.find();
    
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Admin: Update order / Order status - http://localhost:8000/api/v1/admin/order/:id

exports.updateOrder = catchAsyncError(async (req,res,next) => {
    const id = req.params.id;
    const order = await orderModel.findById(id);

    if(order.orderStatus == 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered',400))
    }

    //updating the product stock of each order item

    order.orderItems.forEach( async orderItem => {
       await updateStock(orderItem.product, orderItem.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true
        
    })
})

async function updateStock(productId, quantity) {
    const product = await productModel.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave: false})
}


//Admin: Delete order

exports.deleteOrder = catchAsyncError(async (req,res,next) => {
    const id = req.params.id;
    const order = await orderModel.findById(id);

    if(!order) {
        return next(new ErrorHandler(`Order not found with this id ${id}`,404))
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        
    })
})