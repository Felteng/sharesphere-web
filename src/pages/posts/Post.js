import React, { useRef, useState } from "react";
import { Card, Overlay, Tooltip } from "react-bootstrap";
import css from "../../styles/css/Posts.module.css";
import appCSS from "../../styles/css/App.module.css"
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosInstance } from "../../axios/axiosDefaults";
import { useAuth } from "../../context/AuthContext";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import { FetchNext } from "../../utils/FetchNext";
import Loader from "../../components/Loader";
import CreateComment from "../comments/CreateComment";
import { EditDropdown } from "../../components/EditDropdown";

const Post = (props) => {
  const {
    title,
    content,
    image,
    id,
    owner,
    is_owner,
    profile_id,
    profile_image,
    likes_count,
    like_id,
    comments_count,
    created_at,
    comments,
    setComments,
  } = props;

  const [like, setLike] = useState(like_id);
  const [likeCount, setLikeCount] = useState(likes_count);
  const [commentCount, setCommentCount] = useState(comments_count);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const target = useRef(null);
  const { loggedInUser } = useAuth();

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/likes/", { post: id });
      setLikeCount(likeCount + 1);
      setLike(data.id);
    } catch (error) {
      console.log("Error when liking", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`likes/${like}`);
      setLikeCount(likeCount - 1);
      setLike(null);
    } catch (error) {
      console.log("Error when unliking", error);
    } finally {
      setLoading(false);
    }
  };

  const likeIcon = (
    <>
      <i
        onClick={() => {
          /**
           * Show a tooltip for post owner or logged out users.
           * The tooltip closes automatically after 3 seconds or
           * the next time the icon is clicked.
           *
           * For other users handles liking and unliking.
           */
          if (is_owner || !loggedInUser) {
            setShow(!show);
            !show && setTimeout(() => setShow(false), 3000);
          } else {
            !like ? handleLike() : handleUnlike();
          }
        }}
        className={`${like ? `fa-solid ${css.Liked}` : "fa-regular"}
      fa-heart me-1 ${css.Likes}`}
        ref={target}
      ></i>

      <Overlay target={target.current} show={show} placement="top">
        {(props) => (
          <Tooltip {...props}>
            {is_owner ? (
              <div>You can't like your own post</div>
            ) : (
              <div>You must be logged in to like a post</div>
            )}
          </Tooltip>
        )}
      </Overlay>
    </>
  );

  const commentsIcon = (
    /**
     * Conditonally renders a link for the comments icon on a post
     * if the comments prop has not been passed which, it only is
     * for an individual post page where we don't want to link to
     * the post the user is already on.
     */
    <>
      {!comments ? (
        <Link className={appCSS.Link} to={`/post/${id}`}>
          <i className={`fa-regular fa-comments me-1 ${css.Comments}`}></i>
        </Link>
      ) : (
        <i className={`fa-regular fa-comments me-1 ${css.Comments}`}></i>
      )}
    </>
  );

  const postImage = (
    /**
     * Conditonally renders a link for the for the image on a post
     * if the comments prop has not been passed, which it only is
     * for an individual post page where we don't want to link to
     * the post the user is already on.
     */
    <>
      {!comments ? (
        <Link to={`/post/${id}`}>
          <Card.Img
            className={css.PostImg}
            variant="top"
            src={image}
            alt={title}
          />
        </Link>
      ) : (
        <Card.Img
          className={css.PostImg}
          variant="top"
          src={image}
          alt={title}
        />
      )}
    </>
  );

  return (
    <Card className={css.PostCard}>
      {postImage}
      <div className={css.CardHeader}>
              <Link className={css.OwnerLink} to={`/profile/${profile_id}`}>
        <Avatar src={profile_image} size={30} alt="Post owner" />
        <div className="ms-1">
          <span>{owner}</span>
        </div>
        <div className={css.PostTime}>
          <span className="ms-1 me-1">·</span>
          <span>{created_at}</span>
        </div>
      </Link>
      {is_owner && <EditDropdown />}
      </div>

      <hr className={css.ContentSeparator} />
      <Card.Body className="text-center">
        <Card.Title>{title}</Card.Title>
        <Card.Text>{content}</Card.Text>
      </Card.Body>
      <div className={css.PostStats}>
        <span>
          {likeIcon}
          {likeCount}
        </span>
        <span>
          {commentsIcon}
          {commentCount}
        </span>
      </div>
      {/* Only render comments on a post card if the comments prop has been passed */}
      {comments && (
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={comments.results.length}
          next={() => FetchNext(comments, setComments)}
          hasMore={!!comments.next}
          loader={
            <div className="d-flex mb-2 justify-content-center">
              <Loader />
            </div>
          }
        >
          <CreateComment
            post={id}
            setComments={setComments}
            setCommentCount={setCommentCount}
          />
          <hr className={css.ContentSeparator} />
          {comments.results.map((comment) => (
            <Comment key={comment.id} {...comment} setComments={setComments} setCommentCount={setCommentCount} />
          ))}
        </InfiniteScroll>
      )}
    </Card>
  );
};

export default Post;
