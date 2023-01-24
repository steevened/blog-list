const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' });
    }
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  const field = {
    likes: body.likes,
  };

  const result = await Blog.findByIdAndUpdate(id, field, { new: true });
  res.json(result);
});

blogsRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' });
  }
  try {
    const blog = await Blog.findById(id);
    if (blog) {
      if (blog.user.toString() !== decodedToken.id.toString()) {
        return res.status(401).json({ error: 'invalid token' });
      } else {
        await Blog.findByIdAndRemove(id);
        res.status(204).end();
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
