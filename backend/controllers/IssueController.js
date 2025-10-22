const { WrapAsync } = require("../utils/WrapAsync");
const {Issue} = require('../models/issue.model.js');
const { ExpressError } = require("../utils/ExpressError.js");

const createIssue = WrapAsync(async (req,res)=>{

    const {title,description} = req.body
    const {id} = req.params;
    const issue = new Issue({
        title,description,
        repository:id
    })
    await issue.save()
    res.status(201).json({message:'isssue created',issue})
})

const deleteIssueById = WrapAsync(async (req,res) => {

    const {id} = req.params
    const issue = await Issue.findByIdAndDelete(id);
    if(!issue)
    {
        return res.json({message:"Issue not found !"})
    }
    res.json({message:"Issue deleted successfully !"})
})

const updateIssueById = WrapAsync(async (req,res) => {
    const {id} = req.params

    const {title,description,status} = req.body

    const issue = await Issue.findById(id);
    if(!issue)
    {
        throw new ExpressError(404,"Issue not found")
    }
    if(title)
    {
        issue.title = title;
    }
    if(description)
    {
        issue.description = description;
    }
    if(status)
    {
        issue.status = status
    }
    await issue.save();
    res.status(200).json({message:"issue updated successfully !",issue})
})

const getAllIssue = WrapAsync(async (req,res)=>{
    const {id} = req.params
    const issues = await Issue.find({repository:id})
    res.status(200).json({issues})
    res.send("issue by id")
    res.send("all issues")
})

const getIssueById = WrapAsync(async (req,res)=>{
    const {id} = req.params
    const issue = await Issue.findById(id)
    if(!issue)
    {
       return res.status(400).json({message:"Issue not found with Id "+id})
    }
    res.status(200).json({issue})


})

module.exports = {getIssueById,getAllIssue,updateIssueById,deleteIssueById,createIssue}