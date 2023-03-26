import React from "react";
import "../styles/Login.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { RiLockPasswordLine, RiFacebookCircleFill } from "react-icons/ri";
import { MdAlternateEmail } from "react-icons/md";
import { GrGoogle } from "react-icons/gr";

export function Login() {
  /** @param {SubmitEvent} event */
  function handleSubmit(event) {
    event.preventDefault();

    console.log(event);
  }

  return (
    <div className="login-cnt min-vw-100 min-vh-100">
      <Form onSubmit={handleSubmit} className="col-3 form d-flex flex-column">
        <h1 className="text-white mb-5 title">Login</h1>

        <Form.Group className="col-12 mb-3" controlId="formBasicEmail">
          <Form.Control type="email" placeholder="Email" />
        </Form.Group>

        <Form.Group className="password-container" controlId="formBasicPassword">
          <Form.Control type="password" placeholder="Password" className="" />
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox" className="pb-3">
          <Form.Text>
            <a className="text-white fst-italic text-decoration-none" href="#">
              Esqueceu-se da password?
            </a>
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Lembrar Password" />
        </Form.Group>

        <Button variant="primary" type="submit" className="col-8 p-2 mx-auto mb-5 bg-white text-black rounded-5">
          Login
        </Button>

        <Form.Group className="mt-3 mb-2  d-flex justify-content-center" controlId="formBasicCheckbox">
          <Button variant="primary" type="submit" className="col-5 p-2 rounded-3 mx-auto bg-white text-black">
            Google
          </Button>

          <Button variant="primary" type="submit" className="col-5 rounded-3 mx-auto bg-white text-black">
            Facebook
          </Button>
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox" className="  mx-auto">
          <Form.Text className="text-white">
            Ainda não tem uma conta?{" "}
            <Link className="text-white" to="/signup">
              Crie uma
            </Link>
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  );
}
