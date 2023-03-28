import React from "react";
import "../styles/Login.css";

import Form from "react-bootstrap/Form";

/**
 * @param {Object} props
 * @param {ReactNode} props.children
 * @param {SubmitEvent} props.handleSubmit
 */
export function LoginContainer({ children, handleSubmit }) {
  return (
    <div className="login-cnt min-vw-100 min-vh-100">
      <Form onSubmit={handleSubmit} className="col-3 form d-flex flex-column">
        {children}
      </Form>
    </div>
  );
}
