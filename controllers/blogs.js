const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

blogsRouter.post('/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body)
    const result = await blog.save()
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

module.exports = blogsRouter
