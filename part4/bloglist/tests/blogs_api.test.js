const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("../utils/test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[2]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[3]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[4]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[5]);
  await blogObject.save();
});

test("there are a total of 6 blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("the unique identifier property of the blog posts is named id", async () => {
  const blogs = await helper.blogsInDb();

  blogs.forEach((blog) => {
    assert.ok(blog.id);
  });
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Async/Await simplifies making async calls",
    author: "Test",
    url: "http://example.com/async-await",
    likes: 4,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await helper.blogsInDb();
  assert.strictEqual(response.length, helper.initialBlogs.length + 1);

  const titles = response.map((r) => r.title);
  assert(titles.includes("Async/Await simplifies making async calls"));
});

test("if the likes property is missing from the request, default to 0", async () => {
  const newBlog = {
    title: "Blog without likes property",
    author: "Test",
    url: "http://example.com/blog-without-likes-property",
  };

  await api.post("/api/blogs").send(newBlog).expect(201);

  const response = await helper.blogsInDb();
  const latestBlog = response.slice(-1)[0];
  assert.strictEqual(latestBlog.likes, 0);
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "Blog without url property",
    author: "Test",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAfter = await helper.blogsInDb();

  assert.strictEqual(blogsAfter.length, helper.initialBlogs.length);
});

test("blog without title is not added", async () => {
  const newBlog = {
    url: "http://example.com/blog-without-title-property",
    author: "Test",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAfter = await helper.blogsInDb();

  assert.strictEqual(blogsAfter.length, helper.initialBlogs.length);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);

  assert.ok(!titles.includes(blogToDelete.title));
});

test("a blog can be updated", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedBlogData = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 10,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10);
});

after(async () => {
  await mongoose.connection.close();
});
