const express = require('express')
const { getAllRepositories,CreateRepository,fetchRepositoryById,fetchRepositoryByName,fetchRepositoryForCurrentUser,updateRepositoryById,ToogleVisibilityById,DeleteRepository} = require('../controllers/repoController.js');
const { auth } = require('../middleware/auth.js');

const RepoRouter = express.Router();

// s


RepoRouter.post('/repo/create',CreateRepository);
RepoRouter.get('/repo/all',getAllRepositories);
RepoRouter.get('/repo/name/:name',fetchRepositoryByName);
RepoRouter.get('/repo/:id',fetchRepositoryById);
RepoRouter.get('/repo/user',auth,fetchRepositoryForCurrentUser);
RepoRouter.delete('/repo/delete/:id',auth,DeleteRepository);
RepoRouter.put('/repo/update/:id',auth,updateRepositoryById);
RepoRouter.patch('/repo/toogle/:id',auth,ToogleVisibilityById)





module.exports = {RepoRouter}