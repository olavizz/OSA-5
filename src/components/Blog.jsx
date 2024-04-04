import { useState } from 'react'
import { PropTypes } from 'prop-types'


const Blog = ({ blog, updatedBlog, deleteBlog }) => {

  const blogStyle = {
    background: 'lightgrey',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikes = () => {
    updatedBlog({
      ...blog,
      likes: blog.likes + 1
    })
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog({ blog }) }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button style={hideWhenVisible} onClick={toggleVisibility}>view</button> <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url} <br/>
        {blog.likes} <button onClick={updateLikes}>like</button> <br/>
        {blog.user.name} <br />
        <button onClick={removeBlog}>remove</button>

      </div>
    </div>
  )
}
Blog.propTypes = {
  updatedBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog