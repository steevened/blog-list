const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let result = 0

  if (blogs.length === 0) {
    return 0
  }

  for (obj of blogs) {
    result += obj.likes
  }
  return result
}

const favouriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes))
  const filtered = blogs.filter((blog) => blog.likes === maxLikes)
  const { title, author, likes } = filtered[0]
  const favourite = {
    title,
    author,
    likes,
  }
  return favourite
}

const mostBlogs = (blogs) => {
  let authors = {}

  blogs.forEach((blog) => {
    if (!authors[blog.author]) {
      authors[blog.author] = {
        author: blog.author,
        blogs: 1,
      }
    } else {
      authors[blog.author].blogs++
    }
  })

  let mostProlificAuthor = { author: '', blogs: 0 }

  for (let author in authors) {
    if (authors[author].blogs > mostProlificAuthor.blogs) {
      mostProlificAuthor = authors[author]
    }
  }

  return mostProlificAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
}
