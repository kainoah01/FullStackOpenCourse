const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, blog) => {
    return (accumulator += blog.likes);
  }, 0);
};

const favoriteBlog = (blogs) => {
  let blogWithMostLikes = blogs[0];
  blogs.forEach((blog) => {
    if (blog.likes > blogWithMostLikes.likes) {
      blogWithMostLikes = blog;
    }
  });
  return blogWithMostLikes;
};

// const mostBlogs = (blogs) => {
//     let authorDict = {}
//     blogs.forEach((blog) => {
//         if (blog.author )
//     })
// }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
