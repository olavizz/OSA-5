import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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
    console.log("loggin out", username)
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
    const blog = {
      title: title,
      author: author,
      url: url
    }
    console.log(blog)
    const updatedBlog = await blogService.create(blog)
    console.log(updatedBlog)
    const newBlogs = blogs.concat(updatedBlog)
    setBlogs(newBlogs)
    setErrorMessage(
      `a new blog ${title} by ${author}`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    } catch (error) {
      console.log(error.message)
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
      </div>
      <h2>create new</h2>
      <div>
        title:<input type="text" value={title} onChange={({ target }) => setTitle(target.value)} /><br />
        author:<input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} /><br />
        url:<input type="text" value={url} onChange={({ target }) => setUrl(target.value)} /><br />
        <button onClick={handleNewBlog}>create</button>
      </div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App