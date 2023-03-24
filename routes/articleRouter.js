const router = require("express").Router();
const articleCtrl = require("../controllers/articleCtrl");
const auth = require("../middleware/auth");

router
  .route("/article")
  .post(auth, articleCtrl.createArticle)
  .get(auth, articleCtrl.getArticles);

router
  .route("/article/:id")
  .get(auth, articleCtrl.getArticle)
  .delete(auth, articleCtrl.deleteArticle);

router.patch("/article/:id/like", auth, articleCtrl.likeArticle);

router.patch("/article/:id/unlike", auth, articleCtrl.unLikeArticle);

module.exports = router;
