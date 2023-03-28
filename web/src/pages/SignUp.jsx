import React from "react";
import "../styles/Login.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { Google } from "../components/Google.jsx";
import { Facebook } from "../components/Facebook.jsx";
import { LoginContainer } from "../components/LoginContainer.jsx";
import { BsPerson } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

export function SignUp() {
  /** @param {SubmitEvent} event */
  function handleSubmit(event) {
    event.preventDefault();

    console.log(event);

    window.location.href = "/verificar-conta";
  }

  return (
    <LoginContainer handleSubmit={handleSubmit}>
      <h1 className="text-white mb-5 title">Sign up</h1>

      <InputGroup className="col-12 mb-3">
        <InputGroup.Text id="nome-icon">
          <BsPerson />
        </InputGroup.Text>
        <Form.Control placeholder="Nome" aria-label="Nome" aria-describedby="nome-icon" id="nome" />
      </InputGroup>

      <InputGroup className="col-12 mb-3">
        <InputGroup.Text id="apelido-icon">
          <BsPerson />
        </InputGroup.Text>
        <Form.Control placeholder="Apelido" aria-label="Apelido" aria-describedby="apelido-icon" id="apelido" />
      </InputGroup>

      <InputGroup className="col-12 mb-3">
        <InputGroup.Text id="email-icon">
          <MdAlternateEmail />
        </InputGroup.Text>
        <Form.Control placeholder="Email" aria-label="Email" aria-describedby="email-icon" id="email" />
      </InputGroup>

      <InputGroup className="col-12 mb-3">
        <InputGroup.Text id="password-icon">
          <RiLockPasswordLine />
        </InputGroup.Text>
        <Form.Control
          placeholder="Password"
          aria-label="Password"
          aria-describedby="password-icon"
          id="password"
          type="password"
        />
      </InputGroup>

      <InputGroup className="col-12">
        <InputGroup.Text id="confirmar-password-icon">
          <RiLockPasswordLine />
        </InputGroup.Text>
        <Form.Control
          placeholder="Confirmar password"
          aria-label="Confirmar password"
          aria-describedby="confirmar-password-icon"
          id="confirmar-password"
          type="password"
        />
      </InputGroup>

      <Button variant="primary" type="submit" className="col-8 p-2 mx-auto mb-2 bg-white text-black rounded-5 mt-4">
        Criar conta
      </Button>

      <Form.Group className="mt-3 mb-2 d-flex justify-content-center" controlId="formBasicCheckbox">
        <Button
          variant="primary"
          type="submit"
          className="col-5 p-2 rounded-3 mx-auto bg-white text-black d-flex justify-content-center align-items-center gap-2"
        >
          <Google /> Google
        </Button>

        <Button
          variant="primary"
          type="submit"
          className="col-5 rounded-3 mx-auto bg-white text-black d-flex justify-content-center align-items-center gap-2"
        >
          <Facebook /> Facebook
        </Button>
      </Form.Group>

      <Form.Group controlId="formBasicCheckbox" className="mx-auto">
        <Form.Text className="text-white">
          Já tem uma conta?{" "}
          <Link className="text-white" to="/login">
            Login
          </Link>
        </Form.Text>
      </Form.Group>
    </LoginContainer>
  );
}
