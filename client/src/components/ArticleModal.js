import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { createPost, updatePost } from "../redux/actions/postAction";
import { createArticle } from "../redux/actions/articleAction";
import Icons from "./Icons";
import { imageShow, videoShow } from "../utils/mediaShow";

const ArticleModal = () => {
  const { auth, theme, articlestatus, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [motive, setMotive] = useState("");
  const [images, setImages] = useState([]);

  const [stream, setStream] = useState(false);
  const videoRef = useRef();
  const refCanvas = useRef();
  const [tracks, setTracks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (articlestatus.onEdit) {
      console.log(content,motive, auth, articlestatus )
      dispatch(updatePost({ content,motive, auth, articlestatus }));
    } else {
      console.log(content,motive, auth, articlestatus )
      // dispatch(createPost({ content,motive, images, auth, socket }));
      dispatch(createArticle({ content,motive, auth, socket }));
    }

    setContent("");
    setMotive("");
    if (tracks) tracks.stop();
    dispatch({ type: GLOBALTYPES.ARTICLESTATUS, payload: false });
  };

  useEffect(() => {
    if (articlestatus.onEdit) {
      setContent(articlestatus.content);
      setMotive(articlestatus.motive);
      setImages(articlestatus.images);
    }
  }, [articlestatus]);
console.log("modal")
  return (
    <div className="status_modal">

      <form onSubmit={handleSubmit}>
        <div className="status_header">
          <h5 className="m-0">Create Article</h5>
          <span
            onClick={() =>
              dispatch({
                type: GLOBALTYPES.ARTICLESTATUS,
                payload: false,
              })
            }
          >
            &times;
          </span>
        </div>

        <div className="status_body">
          <textarea
            name="content"
            value={content}
            placeholder={`${auth.user.username}, article likhna hai? 💫`}
            onChange={(e) => setContent(e.target.value)}
            style={{
              filter: theme ? "invert(1)" : "invert(0)",
              color: theme ? "white" : "#111",
              background: theme ? "rgba(0,0,0,.03)" : "",
            }}
          />
          <input 
            type={"text"}
            name="motive"
            value={motive}
            placeholder={`${auth.user.username}, motive? 💫`}
            onChange={(e) => setMotive(e.target.value)}
            style={{
              filter: theme ? "invert(1)" : "invert(0)",
              color: theme ? "white" : "#111",
              background: theme ? "rgba(0,0,0,.03)" : "",
            }}
          />

          <div className="d-flex">
            <div className="flex-fill"></div>
            <Icons setContent={setContent} content={content} theme={theme} />
          </div>

        </div>

        <div className="status_footer">
          <button className="btn btn-primary w-100" type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleModal;
