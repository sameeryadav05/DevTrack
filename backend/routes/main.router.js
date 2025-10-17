const express = require('express')

const mainRouter = express.Router();
const {UserRouter} = require('./user.router.js');
const { RepoRouter } = require('./repo.router.js');
const { issueRouter } = require('./issue.router.js');

mainRouter.use(UserRouter)
mainRouter.use(RepoRouter)
mainRouter.use(issueRouter)


mainRouter.get('/',(req,res)=>res.send("Welcome"))

module.exports = {mainRouter}