const getAllPost = (req, res) => {
  res.render('user/community/all-post', { pageTitle: 'all-post' })
}

const getCreatePost = (req, res) => {
  res.render('user/community/create-post', { pageTitle: 'create-post' })
}

// const postCreatePost = () => {}

module.exports = { getAllPost, getCreatePost }
