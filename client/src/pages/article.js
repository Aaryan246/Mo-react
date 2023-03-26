import React, { useState, useEffect } from "react";
import ArticleStatus from "../components/home/ArticleStatus";
export default function Article(){
    return(
        <div>
            <div className="home row mx-0">
            <div className="col-md-12">
                <ArticleStatus />

                {/* {homePosts.loading ? (
                <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                ) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
                <h2 className="text-center">No Post</h2>
                ) : (
                <Posts />
                )} */}
                <h2>hello</h2>
            </div>

            {/* <div className="col-md-4">
                        <RightSideBar />
                    </div> */}
            </div>
        </div>
        
    )
}