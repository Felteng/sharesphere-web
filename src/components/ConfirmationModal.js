import React from "react";
import { Button, Modal } from "react-bootstrap";
import css from "../styles/css/ConfirmationModal.module.css";

const ConfirmationModal = ({ object, handleDelete, ...props }) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className={css.Body}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title id="contained-modal-title-vcenter">
            Delete {object}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you want to delete this {object}?</h4>
          <p>This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;