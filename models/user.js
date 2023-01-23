const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJson', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._.id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    //the passwordHast should not be reveladed
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
