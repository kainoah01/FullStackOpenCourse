import { useState, useEffect, use } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isError, setIsError] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");

      setIsError(false);
      setNotification("login successful");
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setIsError(true);
      setNotification("wrong username or password");
      setTimeout(() => {
        setNotification(null);
        setIsError(false);
      }, 5000);
    }
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
    };
    const createdBlog = await blogService.create(newBlog);
    setBlogs(blogs.concat(createdBlog));

    setIsError(false);
    setNotification(
      `a new blog "${createdBlog.title}" by ${createdBlog.author} added`,
    );
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <div>
        <p>
          {user.name} logged in
          <button
            onClick={() => {
              setUser(null);
              setToken(null);
              window.localStorage.removeItem("loggedBlogappUser");
            }}
          >
            logout
          </button>
        </p>
      </div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  const createBlogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input type="text" name="title" />
        </div>
        <div>
          author:
          <input type="text" name="author" />
        </div>
        <div>
          url:
          <input type="text" name="url" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );

  return (
    <>
      <Notification message={notification} isError={isError} />
      {!user && loginForm()}
      {user && blogForm()}
      {user && createBlogForm()}
    </>
  );
};

export default App;
