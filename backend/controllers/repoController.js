const {ExpressError} = require('../utils/ExpressError.js')
const {WrapAsync} = require('../utils/WrapAsync.js')

const CreateRepository = WrapAsync(async (req,res)=>{
    res.send("created repository")
})

const getAllRepositories = WrapAsync(async (req,res)=>{
    res.send("All repository")
})

const DeleteRepository = async (req,res)=>{
    res.send("deleted a repository")
};

const fetchRepositoryById = WrapAsync(async (req,res)=>{
    res.send("repository fetched");
})

const fetchRepositoryByName = WrapAsync(async (req,res)=>{
    res.send("repository fetched");
})

const fetchRepositoryForCurrentUser = WrapAsync(async (req,res)=>{
    res.send("users repositories");
})

const updateRepositoryById= WrapAsync(async (req,res)=>{
    res.send("updated repository")
})
const ToogleVisibilityById = WrapAsync(async (req,res)=>{
    res.send("updated repository visibilty")
})


module.exports = {
    ToogleVisibilityById,updateRepositoryById,fetchRepositoryForCurrentUser,fetchRepositoryByName,fetchRepositoryById,getAllRepositories,CreateRepository,DeleteRepository
}