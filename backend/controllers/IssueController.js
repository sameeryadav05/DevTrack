const { WrapAsync } = require("../utils/WrapAsync");


const createIssue = WrapAsync(async (req,res)=>{
    res.send('isssue created')
})

const deleteIssueById = WrapAsync(async (req,res) => {
    res.send('deleted issue')
})

const updateIssueById = WrapAsync(async (req,res) => {
    res.send("updated issue")
})

const getAllIssue = WrapAsync(async (req,res)=>{
    res.send("all issues")
})

const getIssueById = WrapAsync(async (req,res)=>{
    res.send("issue by id")
})

module.exports = {getIssueById,getAllIssue,updateIssueById,deleteIssueById,createIssue}