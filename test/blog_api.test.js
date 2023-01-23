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

  console.log('done')
})

describe('when there is initially some blogs saved', () => {
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
})

describe('viewing a specific blog', () => {
  test('succed with a valid id', async () => {
    const blogsInDb = await helper.blogsInDb()

    const blogToView = blogsInDb[0]

    const result = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual(blogToView)
  })

  test('a unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding a new note', () => {
  test('succed with valid data', async () => {
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

  test('fails with status code 400 if data invalid', async () => {
    const newBlog = {
      author: 'someone',
      url: 'https://someone.com',
      likes: 34,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.blogs.length)
  })
})

describe('updating a blog', () => {
  test('succed with status 200', async () => {
    const field = {
      likes: 123,
    }
    const blogsatStart = await helper.blogsInDb()
    const blogToUpdate = blogsatStart[0]
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(field).expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const likesArray = blogsAtEnd.map((r) => r.likes)

    expect(likesArray).toContain(field.likes)
    expect(blogsAtEnd).toHaveLength(helper.blogs.length)
  })
})

describe('deleting a blog', () => {
  test('succed with a status 204 if id is valid', async () => {
    const blogsatStart = await helper.blogsInDb()
    const blogToDelete = blogsatStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    // expect(blogsAtEnd).toHaveLength(helper.blogs - 1)

    const authors = blogsAtEnd.map((r) => r.authors)

    expect(authors).not.toContain(blogToDelete.author)
  })
})

jest.setTimeout(25000)

afterAll(() => {
  mongoose.connection.close()
})
