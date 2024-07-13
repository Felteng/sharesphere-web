import React, { useState } from "react";
import css from "../../styles/css/Comments.module.css";
import postCSS from "../../styles/css/Posts.module.css";
import dropdownCSS from "../../styles/css/EditDropdown.module.css";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { Link } from "react-router-dom";
import { EditDropdown } from "../../components/EditDropdown";
import EditComment from "./EditComment";
import { axiosInstance } from "../../axios/axiosDefaults";

const Comment = (props) => {
  const {
    content,
    id,
    is_owner,
    owner,
    profile_id,
    profile_image,
    updated_at,
    created_at,
    setComments,
    setCommentCount,
  } = props;

  const [editToggled, setEditToggled] = useState(false);
  const [originalCommentData, setOriginalCommentData] = useState(null);
  const [commentData, setCommentData] = useState({
    content: content,
  });

  const toggleEdit = () => {
    if (!editToggled) {
      setOriginalCommentData(commentData.content);
      setEditToggled(true);
    } else {
      setCommentData({
        content: originalCommentData,
      });
      setEditToggled(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/comments/${id}`, commentData);
      setEditToggled(false);
    } catch (error) {
      console.log("Error when updating comment:", error);
    }
  };

  const handleDelete = async () => {
    console.log("delete comment");
  };

  return (
    <Card className={css.CommentCard}>
      <div className={postCSS.CardHeader}>
        <Link className={postCSS.OwnerLink} to={`/profile/${profile_id}`}>
          <Avatar src={profile_image} size={25} alt="Comment owner" />
          <div className="ms-1">
            <span>{owner}</span>
          </div>
          <div className={postCSS.PostTime}>
            <span className="ms-1 me-1">·</span>
            <OverlayTrigger
              overlay={
                <Tooltip id="tooltip-disabled">Updated: {updated_at}</Tooltip>
              }
            >
              <span className="d-inline-block">
                <span>{created_at}</span>
              </span>
            </OverlayTrigger>
          </div>
        </Link>
        {is_owner && !editToggled && (
          <EditDropdown confirmDelete={handleDelete} toggleEdit={toggleEdit} />
        )}
        {is_owner && editToggled && (
          <i className={`fa-solid fa-xmark ${dropdownCSS.ToggleIcon}`} onClick={toggleEdit}></i>
        )}
      </div>
      <hr className={postCSS.ContentSeparator} />
      <Card.Body className={css.CommentBody}>
        {!editToggled ? (
          <Card.Text>{commentData.content}</Card.Text>
        ) : (
          <EditComment
            handleEdit={handleEdit}
            commentData={commentData}
            setCommentData={setCommentData}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default Comment;
