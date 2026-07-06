const express = require('express');
const blogController = require('../controllers/blog.controller');

const postRouter = express.Router();
postRouter.route('/')
  .get(blogController.getPostsAdmin)
  .post(blogController.createPost);

postRouter.route('/:id')
  .get(blogController.getPostById)
  .put(blogController.updatePost)
  .delete(blogController.deletePost);

const categoryRouter = express.Router();
categoryRouter.route('/')
  .get(blogController.getCategories)
  .post(blogController.createCategory);

categoryRouter.route('/:id')
  .put(blogController.updateCategory)
  .delete(blogController.deleteCategory);

module.exports = {
  postRouter,
  categoryRouter
};
