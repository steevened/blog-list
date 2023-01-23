const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')
  await Blog.insertMany(helper.blogs)

  // const blogsObject = helper.blogs.map((blog) => new Blog(blog))

  // const promiseArray = blogsObject.map((blog) => blog.save())
  // await Promise.all(promiseArray)

  console.log('done')
})

test('all blogs are returned as json', async () => {
  console.log('entered test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.blogs.length)
})

test('a specific author within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const authors = response.body.map((r) => r.author)

  expect(authors).toContain('Edsger W. Dijkstra')
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'florida',
    author: 'miami',
    url: 'sfafsd',
    likes: 22,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map((r) => r.title)

  expect(response.body).toHaveLength(helper.blogs.length + 1)
  expect(titles).toContain('florida')
})

test('a unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

// test('if likes are missing, the default value is 0', async (req, res) => {
//   const response = await api.get('/api/blogs')
// })

jest.setTimeout(25000)

afterAll(() => {
  mongoose.connection.close()
})
