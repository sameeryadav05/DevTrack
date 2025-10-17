const express = require('express')
const { createIssue, getAllIssue, getIssueById, deleteIssueById, updateIssueById } = require('../controllers/IssueController')

const issueRouter = express.Router()


issueRouter.post('/issue/create',createIssue);
issueRouter.get('/issue/all',getAllIssue);
issueRouter.get('/issue/:id',getIssueById);
issueRouter.delete("/issue/delete/:id",deleteIssueById)
issueRouter.put('/issue/update/:id',updateIssueById);




module.exports = { issueRouter }