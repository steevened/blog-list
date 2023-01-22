const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.blogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.blogs[1])
  await blogObject.save()
})

test('all blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.blogs.length)
})

// test('a specific author within the returned blogs', async () => {
//   const response = await api.get('/api/blogs')
//   const authors = response.body.map((r) => r.author)

//   expect(authors).toContain('Edsger W. Dijkstra')
// })

// test('a valid blog can be added', async () => {
//   const newBlog = {
//     title: 'florida',
//     author: 'miami',
//     url: 'sfafsd',
//     likes: 22,
//   }

//   await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)

//   const response = await api.get('/api/blogs')
//   const titles = response.body.map((r) => r.title)

//   expect(response.body).toHaveLength(blogs.length + 1)
//   expect(titles).toContain('florida')
// })

// test('blog without title is not added', async () => {
//   const newBlog = {
//     author: 'miami',
//     url: 'sfafsd',
//     likes: 22,
//   }

//   await api.post('/api/blogs').send(newBlog).expect(400)

//   const response = await api.get('/api/blogs')
//   expect(response.body).toHaveLength(blogs)
// })

afterAll(() => {
  mongoose.connection.close()
}, 100000)
