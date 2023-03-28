import React, { useState, useEffect } from "react";
import ArticleStatus from "../components/home/ArticleStatus";
import { useSelector } from "react-redux";
import LoadIcon from "../images/loading.gif";
import Articles from "../components/home/Article";

let scroll = 0;
export default function Article() {
  const { articlePosts, homePosts } = useSelector((state) => state);

  window.addEventListener("scroll", () => {
    if (window.location.pathname === "/") {
      scroll = window.pageYOffset;
      return scroll;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: scroll, behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <div>
      <div className="home row mx-0">
        <div className="col-md-12">
          <ArticleStatus />
          {articlePosts.loading ? (
            <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
          ) : articlePosts.result === 0 && articlePosts.article.length === 0 ? (
            <h2 className="text-center">No Post</h2>
          ) : (
            <Articles />
          )}
        </div>
      </div>
    </div>
  );
}
