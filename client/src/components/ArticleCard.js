import React from "react";
import ArticleHeader from "./home/post_card/ArticleHeader";
import ArticleBody from "./home/post_card/ArticleBody";
import CardFooter from "./home/post_card/CardFooter";

import Comments from "./home/Comments";
import InputComment from "./home/InputComment";

const ArticleCard = ({ post, theme }) => {
  return (
    <div className="card my-3">
      <ArticleHeader post={post} />
      <ArticleBody post={post} theme={theme} />
      {/* <CardFooter post={post} /> */}
      {/* 
            <Comments post={post} />
            <InputComment post={post} /> */}
    </div>
  );
};

export default ArticleCard;
