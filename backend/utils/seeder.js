const conectDB = require('../config/db');
const products = require('../data/product.json');
const productModel = require("../models/productModel");
const dontenv = require('dotenv');

dontenv.config({path: "config/config.env"});
conectDB();

const seederProducts =async ()=> {
    try {
      await productModel.deleteMany();
      console.log("products deleted");
      await productModel.insertMany(products);
      console.log("products added");
    } catch (error) {
        console.log(error.message)
    }
    process.exit();
}

seederProducts();