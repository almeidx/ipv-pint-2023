import React from "react";
import "../styles/Login.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { LoginContainer } from "../components/LoginContainer.jsx";
import { RiLockPasswordLine } from "react-icons/ri";

export function VerificarConta() {
  /** @param {SubmitEvent} event */
  function handleSubmit(event) {
    event.preventDefault();

    console.log(event);
  }

  return (
    <LoginContainer handleSubmit={handleSubmit}>
      <h1 className="text-white title mb-4" style={{ fontSize: "3rem" }}>
        Verificar Conta
      </h1>

      <Form.Group>
        <Form.Text className="text-white">
          Foi enviado um código para o seu email abc@abc.com. Por favor, introduza-o abaixo. O código irá expirar em 5
          minutos.
        </Form.Text>
      </Form.Group>

      <InputGroup className="my-5">
        <InputGroup.Text id="code-icon">
          <RiLockPasswordLine />
        </InputGroup.Text>
        <Form.Control placeholder="Código" aria-label="Código" aria-describedby="code-icon" />
      </InputGroup>

      <Form.Group className="mt-3 mb-2 d-flex justify-content-around" controlId="formBasicCheckbox">
        <Button variant="primary" type="submit" className="col-5 p-2 rounded-5 bg-white text-black">
          Submeter
        </Button>

        <Button variant="primary" type="submit" className="col-5  p-2 rounded-5 bg-white text-black">
          Re-enviar
        </Button>
      </Form.Group>
    </LoginContainer>
  );
}
