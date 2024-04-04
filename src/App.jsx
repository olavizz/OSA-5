import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('loggin out', username)
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  const handleNewBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      console.log(blogObject)
      const updatedBlog = await blogService.create(blogObject)
      console.log(updatedBlog)
      const newBlogs = blogs.concat(updatedBlog)
      setBlogs(newBlogs)
      setErrorMessage(
        `a new blog ${ blogObject.title } by ${ blogObject.author }`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      console.log(error.message)
    }
  }

  const blogFormRef = useRef()

  const updateObject = async (updatedObj) => {
    try {
      console.log('tähän asti ok', updatedObj)
      const updatedLikes = await blogService.update(updatedObj)
      console.log(updatedLikes)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      console.log('delete funktiossa App komponentissa')
      const response = await blogService.deleblog(blog)
      console.log(response)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (error) {
      console.log(error)
    }
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div>
        <h2>{message}</h2>
      </div>
    )
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div> <br />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={handleNewBlog}
        />
      </Togglable>
      <div/>
      <br />
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updatedBlog={updateObject} deleteBlog={deleteBlog} />
      )}
    </div>
  )
}

export default App