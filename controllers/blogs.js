const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/blogs', async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/blogs/:id', async (req, res, next) => {
  const { id } = req.params

  const blog = await Blog.findById(id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/blogs', async (req, res, next) => {
  const { body } = req
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })
  try {
    const result = await blog.save()
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/blogs/:id', async (req, res, next) => {
  const { body } = req
  const { id } = req.params
  const field = {
    likes: body.likes,
  }

  const result = await Blog.findByIdAndUpdate(id, field, { new: true })
  res.json(result)
})

blogsRouter.delete('/blogs/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    await Blog.findByIdAndRemove(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
