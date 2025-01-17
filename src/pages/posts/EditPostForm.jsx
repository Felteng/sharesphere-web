import React, { useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Image from "react-bootstrap/Image";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import postCSS from "../../styles/css/Posts.module.css";
import formCSS from "../../styles/css/Forms.module.css";
import dropdownCSS from "../../styles/css/EditDropdown.module.css";
import Avatar from "../../components/Avatar";
import { axiosReq } from "../../axios/axiosDefaults";

const EditPostForm = ({ setPostData, postData, toggleEdit, id }) => {
  const [newPostData, setNewPostData] = useState({
    title: postData.title,
    content: postData.content,
    image: null,
  });
  const [originalImage] = useState(postData.image);
  const [previewImage, setPreviewImage] = useState(null);
  const { title, content } = newPostData;
  const {
    owner,
    profile_image,
    likes_count,
    comments_count,
    created_at,
    updated_at,
  } = postData;

  const [errors, setErrors] = useState();

  const imageUpload = useRef();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setNewPostData({
      ...newPostData,
      image: file,
    });
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = async (e) => {
    setNewPostData({
      ...newPostData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = async (e) => {
    /**
     * Handles edit submission.
     * Image is only added if one has been submitted,
     * otherwise it's omitted in the payload.
     *
     * Updates the newPostData state to set image to null again,
     * so that it isn't uploaded again without actually changing.
     */
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newPostData.title);
    formData.append("content", newPostData.content);
    if (newPostData.image) {
      formData.append("image", newPostData.image);
    }
    try {
      const { data } = await axiosReq.put(`/posts/${id}/`, formData);
      setPostData({
        ...postData,
        title: data.title,
        content: data.content,
        image: data.image,
      });

      setNewPostData({
        ...newPostData,
        image: null,
      });

      toggleEdit();
    } catch (error) {
      setErrors(error.response?.data);
    }
  };

  return (
    <>
      <Form className="text-center" onSubmit={handleEdit}>
        <div className={postCSS.PostImg}>
          <FormGroup controlId="postImage" className="text-center">
            <FormLabel className={formCSS.FormImage}>
              <Image
                className={formCSS.UploadPreview}
                // Update preview image based on file input
                src={
                  imageUpload.current?.files[0] ? previewImage : originalImage
                }
                alt="Chosen post image"
              />
              <div>Tap to change image!</div>
            </FormLabel>
            <FormControl
              className="d-none"
              type="file"
              accept="image/jpeg,image/png,image/bmp"
              onChange={handleImageChange}
              ref={imageUpload}
            ></FormControl>
          </FormGroup>
        </div>
        {errors?.image?.map((err) => (
          <Alert key={err} variant="warning">
            {err}
          </Alert>
        ))}
        <div className={postCSS.CardHeader}>
          <div className={postCSS.OwnerLink}>
            <Avatar src={profile_image} size={30} alt="Post owner" />

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
          </div>
          <i
            className={`fa-solid fa-xmark ${dropdownCSS.ToggleIcon}`}
            onClick={toggleEdit}
          ></i>
        </div>

        <hr className={postCSS.ContentSeparator} />

        <Card.Body className="text-center">
          <Card.Title>
            <Form.Group className="mb-3" controlId="postTitle">
              <Form.Label className="sr-only">Title</Form.Label>
              <Form.Control
                className={formCSS.FormInput}
                type="text"
                placeholder="Post title"
                value={title}
                name={"title"}
                onChange={handleChange}
                maxLength={50}
              />
            </Form.Group>
          </Card.Title>
          {errors?.title?.map((err) => (
            <Alert key={err} variant="warning" className="mt-2">
              {err}
            </Alert>
          ))}
          <Card.Text as={"div"}>
            <Form.Group className="mb-3" controlId="postContent">
              <Form.Label className="sr-only">Post content</Form.Label>
              <Form.Control
                className={formCSS.FormInput}
                as="textarea"
                rows={5}
                placeholder="Post content"
                value={content}
                name="content"
                onChange={handleChange}
                maxLength={200}
              />
            </Form.Group>
          </Card.Text>
        </Card.Body>
        <Button className="mb-3" type="submit" variant="primary">
          Update post! <i className="fa-solid fa-pencil"></i>
        </Button>
      </Form>

      <div className={postCSS.PostStats}>
        <span>
          <i className={`fa-regular fa-heart me-1 ${postCSS.Likes}`}></i>
          {likes_count}
        </span>
        <span>
          <i className={`fa-regular fa-comments me-1 ${postCSS.Comments}`}></i>
          {comments_count}
        </span>
      </div>
    </>
  );
};

export default EditPostForm;
