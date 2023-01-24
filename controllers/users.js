const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      likes: 1,
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await User.findOne({ _id: id }).populate('blogs');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    if (password.length < 3) {
      return res.status(400).json({
        error: 'password must be at least 3 characters long',
      });
    }

    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await User.findByIdAndRemove(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
