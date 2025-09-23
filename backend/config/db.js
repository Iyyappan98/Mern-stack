const mongoose = require('mongoose');


const conectDB = async () =>{
    await mongoose.connect(process.env.DB_URI,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    }).then(()=>{
        console.log("DB CONECTED");
    })
}

module.exports = conectDB;

