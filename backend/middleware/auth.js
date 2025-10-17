const { User } = require("../models/user.model");
const { ExpressError } = require("../utils/ExpressError");
const { WrapAsync } = require("../utils/WrapAsync");
const jwt = require('jsonwebtoken')


const auth = WrapAsync(async (req,res,next)=>{

    const {token} = req.cookies

    if(!token)
    {
        throw new ExpressError(401,"User is not Authenticated")
    }

    const decoded = await jwt.verify(token,process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
    req.user = user
    next()
})



module.exports = {auth}