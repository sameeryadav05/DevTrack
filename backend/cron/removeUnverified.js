const cron = require('node-cron')
const { User } = require('../models/user.model')


const removeUnverifiedUser = ()=>{

    try {
        cron.schedule("*/2 * * * *",async()=>{
        const FifteenMinutesBefore = new Date(Date.now() - 15*60*1000)
        await User.deleteMany({
        accountVerified:false,
        createdAt:{$lt:FifteenMinutesBefore}})
    })

    } catch (error) {
        throw new Error('Somthing went wrong !')
    }
}


module.exports = {removeUnverifiedUser}