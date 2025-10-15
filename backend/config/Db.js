const mongoose = require('mongoose')
require('dotenv').config()

const main = async ()=>{
    await mongoose.connect(process.env.MONGODB_URL,{dbName:'DevTrack'})
    console.log('Database connected successfully !');
}

module.exports = {main}
