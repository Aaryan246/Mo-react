import React from "react";
import Avatar from "../Avatar";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const ArticleStatus = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
console.log("hello")
  return (
    <div className="status my-3 d-flex">
      <Avatar src={auth.user.avatar} size="big-avatar" />

      <button
        className="statusBtn flex-fill"
        onClick={() => dispatch({ type: GLOBALTYPES.ARTICLESTATUS, payload: true })}
      >
        {auth.user.username}, Write an Article...
      </button>
    </div>
  );
};

export default ArticleStatus;
