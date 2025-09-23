const app = require('./app');

const conectDB = require('./config/db');




conectDB();
const server = app.listen(process.env.PORT, ()=>{
    console.log(`server listening to the ${process.env.PORT} is ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection',(err)=>{
   console.log(`Error: ${err.message}`);
   console.log('Shuting down the server due to unhandled rejection ');
   server.close(()=>{
    process.exit(1);
   })
})

process.on('uncaughtException',(err)=>{
   console.log(`Error: ${err.message}`);
   console.log('Shuting down the server due to uncaughtException rejection ');
   server.close(()=>{
    process.exit(1);
   })
})

// console.log(a);