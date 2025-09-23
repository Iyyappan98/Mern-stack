const catchAsyncError = require('../middlewares/catchAsyncError');
const userModel = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require('../utils/jwt');
const crypto = require('crypto');


//Register-user - http://localhost:8000/api/v1/register
exports.registerUser = catchAsyncError(async (req,res,next) =>{
    const {name,email,password} = req.body;



    let avatar;

    let BASE_URL = process.env.BACKEND_URL;

    if(process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    if(req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
    }
    const user = await userModel.create({
        name,
        email,
        password,
        avatar
    })
    if (!name || !email || !password) {
    return next(new ErrorHandler('Please provide name, email and password', 400));
    }
    sendToken(user,201,res);

    // const token = user.getJwtToken();

    // res.status(201).json({
    //     success: true,
    //     user,
    //     token
    // })
})

//Loginuser - http://localhost:8000/api/v1/login

exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    if(!await user.isValidPassword(password)){
         return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user,201,res)
})

//Logout user - http://localhost:8000/api/v1/logout

exports.logoutUser = (req,res,next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    .status(200)
    .json({
        success: true,
        message: 'Loggedout'
    })
}

//Forgot password - http://localhost:8000/api/v1/password/forgot

exports.forgotPassword = catchAsyncError(async (req,res,next) => {
    const user =  await userModel.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('User not found with this email',404))
    }

    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave: false});

    //create reset Url 

    let BASE_URL = process.env.FRONTEND_URL;

    if(process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

    const message = `your password reset url is as follow  \n\n
    ${resetUrl} \n\n If you have not requested this email, then ignore it`

    try {
       await sendEmail({
            email: user.email,
            subject: "iyyappancart password recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `email sent to ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message),500)
    }
})

//Reset password - http://localhost:8000/api/v1/password/reset/(emailgenratetoken)

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() } // ✅ fixed spelling
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined; // ✅ fixed spelling

    await user.save();

    sendToken(user, 200, res);
});


//Get User Profile - http://localhost:8000/api/v1/myprofile

exports.getUserProfile = catchAsyncError(async (req,res,next) => {
  const user =  await userModel.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  })
})

//change password = http://localhost:8000/api/v1/password/change

exports.changePassword = catchAsyncError(async (req,res,next) => {
    const user = await userModel.findById(req.user.id).select('+password');
    
    //check old password
    if(!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('old password is incorrect',401))
    }

    //assigning new password
    user.password = req.body.password;

    await user.save();
    res.status(200).json({
    success: true
    
  })
})

//Update profile

exports.updateProfile = catchAsyncError(async (req,res,next) =>{
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    let BASE_URL = process.env.BACKEND_URL;

    if(process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    let avatar;
    if(req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
        newUserData = {...newUserData, avatar}
    }
    const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Get all users - http://localhost:8000/api/v1/admin/users

exports.getAllUsers = catchAsyncError(async (req,res,next) => {
   const users =  await userModel.find();
   res.status(200).json({
      success: true,
      users
   })
})

//Admin: Get specific user - http://localhost:8000/api/v1/admin/user/:id

exports.getSpecificUser = catchAsyncError(async (req,res,next) => {
     const id = req.params.id;
     const user = await userModel.findById(id);

     if(!user) {
        return next(new ErrorHandler(`User not found with this id ${id}`))
     }

     res.status(200).json({
        success: true,
        user
     })
})

//Admin:  update user - http://localhost:8000/api/v1/admin/user/:id

exports.updateUser = catchAsyncError(async (req,res,next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin:  Delete user

exports.deleteUser = catchAsyncError(async (req,res,next) => {
    const id = req.params.id;
    const user = await userModel.findById(id);

     if(!user) {
        return next(new ErrorHandler(`User not found with this id ${id}`))
     }

     await user.deleteOne();

     res.status(200).json({
        success: true,
        
    })
})