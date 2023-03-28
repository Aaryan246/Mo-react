const Article = require("../models/articleModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const articleCtrl = {
  createArticle: async (req, res) => {
    try {
      console.log(req.body);
      const { content, motive } = req.body;
      console.log(motive);
      const newArticle = new Article({
        content,
        motive,
        user: req.user._id,
      });
      await newArticle.save();

      res.json({
        msg: "Created Article!",
        newArticle: {
          ...newArticle._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getArticles: async (req, res) => {
    try {
      const features = new APIfeatures(
        Article.find({
          user: [...req.user.following, req.user._id],
        }),
        req.query
      );

      const article = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      res.json({
        msg: "Success!",
        result: article.length,
        article,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // updateArticle: async (req, res) => {
  //     try {
  //         const { content,motive} = req.body

  //         const post = await Posts.findOneAndUpdate({_id: req.params.id}, {
  //             content,motive, images
  //         }).populate("user likes", "avatar username fullname")
  //         .populate({
  //             path: "comments",
  //             populate: {
  //                 path: "user likes",
  //                 select: "-password"
  //             }
  //         })

  //         res.json({
  //             msg: "Updated Post!",
  //             newPost: {
  //                 ...post._doc,
  //                 content, images
  //             }
  //         })
  //     } catch (err) {
  //         return res.status(500).json({msg: err.message})
  //     }
  // },
  likeArticle: async (req, res) => {
    try {
      const article = await Article.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (post.length > 0)
        return res.status(400).json({ msg: "You liked this article." });

      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This article does not exist." });

      res.json({ msg: "Liked Article!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unLikeArticle: async (req, res) => {
    try {
      const like = await Article.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ msg: "This article does not exist." });

      res.json({ msg: "UnLiked Article!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // getUserPosts: async (req, res) => {
  //     try {
  //         const features = new APIfeatures(Posts.find({user: req.params.id}), req.query)
  //         .paginating()
  //         const posts = await features.query.sort("-createdAt")

  //         res.json({
  //             posts,
  //             result: posts.length
  //         })

  //     } catch (err) {
  //         return res.status(500).json({msg: err.message})
  //     }
  // },
  getArticle: async (req, res) => {
    try {
      const article = await Article.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      if (!article)
        return res.status(400).json({ msg: "This article does not exist." });

      res.json({
        article,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // getPostsDicover: async (req, res) => {
  //     try {

  //         const newArr = [...req.user.following, req.user._id]

  //         const num  = req.query.num || 9

  //         const posts = await Posts.aggregate([
  //             { $match: { user : { $nin: newArr } } },
  //             { $sample: { size: Number(num) } },
  //         ])

  //         return res.json({
  //             msg: 'Success!',
  //             result: posts.length,
  //             posts
  //         })

  //     } catch (err) {
  //         return res.status(500).json({msg: err.message})
  //     }
  // },
  deleteArticle: async (req, res) => {
    try {
      const article = await Article.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({
        msg: "Deleted article!",
        newArticle: {
          ...article,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // savePost: async (req, res) => {
  //     try {
  //         const user = await Users.find({_id: req.user._id, saved: req.params.id})
  //         if(user.length > 0) return res.status(400).json({msg: "You saved this post."})

  //         const save = await Users.findOneAndUpdate({_id: req.user._id}, {
  //             $push: {saved: req.params.id}
  //         }, {new: true})

  //         if(!save) return res.status(400).json({msg: 'This user does not exist.'})

  //         res.json({msg: 'Saved Post!'})

  //     } catch (err) {
  //         return res.status(500).json({msg: err.message})
  //     }
  // },
  // unSavePost: async (req, res) => {
  //     try {
  //         const save = await Users.findOneAndUpdate({_id: req.user._id}, {
  //             $pull: {saved: req.params.id}
  //         }, {new: true})

  //         if(!save) return res.status(400).json({msg: 'This user does not exist.'})

  //         res.json({msg: 'unSaved Post!'})

  //     } catch (err) {
  //         return res.status(500).json({msg: err.message})
  //     }
  // },
  // getSavePosts: async (req, res) => {
  //     try {
  //         const features = new APIfeatures(Posts.find({
  //             _id: {$in: req.user.saved}
  //         }), req.query).paginating()

  //         const savePosts = await features.query.sort("-createdAt")

  //         res.json({
  //             savePosts,
  //             result: savePosts.length
  //         })

  //     } catch (err) {
  //         return res.status(500).json({msg: err.message})
  //     }
  // },
};

module.exports = articleCtrl;
