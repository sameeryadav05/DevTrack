const { Repository } = require('../models/repo.model.js')
const { User } = require('../models/user.model.js')
const { Issue } = require('../models/issue.model.js')
const {ExpressError} = require('../utils/ExpressError.js')
const {WrapAsync} = require('../utils/WrapAsync.js')
const mongoose  = require('mongoose')



const CreateRepository = WrapAsync(async (req,res)=>{
    const {owner,name,issues,content,description,visibility} = req.body

    if(!name?.trim())
    {
        throw new ExpressError(400,"Repository name is required !")
    }
    if(!mongoose.Types.ObjectId.isValid(owner))
    {
        throw new ExpressError(400,"Invalid owner id !");
    }
    const user = await User.findById(owner);
    if(!user){
        throw new ExpressError(400,"owner not found,failed to create the repository !")
    }
    const newRepository = new Repository({
        name: name.trim(),
        description: description?.trim() || '',
        visibility,
        owner,
        content: content || '',
        issues: issues || [],
    })
    const result = await newRepository.save();
    user.repositories.push(result._id);
    await user.save();
    res.status(201).json({message:"Repository created",RepositoryId:result._id})
})

const getAllRepositories = WrapAsync(async (req,res)=>{

    const repositories = await Repository.find({}).populate("owner").populate("issues");

    // dfdf


    res.status(200).json(repositories);
})

const fetchRepositoryById = WrapAsync(async (req,res)=>{
    const id = req.params.id
    
    const repository = await Repository.findById(id).populate('owner').populate('issues')

    if(!repository)
    {
        throw new ExpressError(404,"Repository not found !");
    }
    res.status(200).json({repository})
})

const fetchRepositoryByName = WrapAsync(async (req,res)=>{
        const name = req.params.name
    
    const repository = await Repository.findOne({name}).populate('owner').populate('issues')

    if(!repository)
    {
        throw new ExpressError(404,"Repository not found !");
    }
    res.status(200).json({repository})
})

const DeleteRepository = async (req,res)=>{
    const id = req.params.id

    await Repository.findByIdAndDelete(id);
    res.json({message:"Repository deleted successfully !"})
};



const fetchRepositoryForCurrentUser = WrapAsync(async (req,res)=>{

    const userId = req.user.id;
    const repositories = await Repository.find({owner:userId});

    if(!repositories.length)
    {
        return res.status(404).json({message:"No Repository found !"})
    }

    res.status(200).json({repositories})
})

const updateRepositoryById= WrapAsync(async (req,res)=>{
    const id = req.params.id
    const {content,description} = req.body

 const repo = await Repository.findById(id)
 if(!repo)
 {
    throw new ExpressError(404,"Repository not found !")
 }
 repo.content.push(content);
 repo.description = description;
    const updatedRepo = await repo.save();
    res.send("updated repository")
})
const ToogleVisibilityById = WrapAsync(async (req,res)=>{
    const id = req.params.id
    const {visibility} = req.body;
    if(visibility !== "public" && visibility !== "private")
    {
        throw new ExpressError(404,"Invalid Visibility type !")
    }
    
    const repo = await Repository.findById(id);
    if(!repo){
        throw new ExpressError(404,"Repository not found !")
    }
    if(repo.visibility == visibility)
    {
        return res.json({message:'Visibility already set to this value.'})
    }

    repo.visibility = visibility;

    await repo.save()
    res.send("updated repository visibilty")
})


module.exports = {
    ToogleVisibilityById,updateRepositoryById,fetchRepositoryForCurrentUser,fetchRepositoryByName,fetchRepositoryById,getAllRepositories,CreateRepository,DeleteRepository
}