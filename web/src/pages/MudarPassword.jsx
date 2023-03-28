import React from "react";
import "../styles/Login.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { LoginContainer } from "../components/LoginContainer.jsx";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useQuery } from "../hooks/useQuery.jsx";
import { Link } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";

export function MudarPassword() {
  const query = useQuery();

  const fromProfile = query.has("from-profile");

  /** @param {SubmitEvent} event */
  function handleSubmit(event) {
    event.preventDefault();

    console.log(event);
  }

  return (
    <LoginContainer handleSubmit={handleSubmit}>
      <div className="d-flex align-items-center gap-1 mb-5">
        {!fromProfile ? (
          <Link to="/login">
            <HiOutlineArrowLeft size={32} color="white" />
          </Link>
        ) : null}

        <h1 className="text-white title" style={{ fontSize: "2rem" }}>
          Mudar Password
        </h1>
      </div>

      {fromProfile ? (
        <InputGroup className="col-12 mb-3">
          <InputGroup.Text id="password-atual-icon">
            <RiLockPasswordLine />
          </InputGroup.Text>
          <Form.Control
            placeholder="Password Atual"
            aria-label="Password Atual"
            aria-describedby="password-atual-icon"
            id="password-atual"
            type="password"
          />
        </InputGroup>
      ) : null}

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

      <InputGroup className="col-12 mb-3">
        <InputGroup.Text id="confirmar-password-icon">
          <RiLockPasswordLine />
        </InputGroup.Text>
        <Form.Control
          placeholder="Confirmar Password"
          aria-label="Confirmar Password"
          aria-describedby="confirmar-password-icon"
          id="confirmar-password"
          type="password"
        />
      </InputGroup>

      <Button variant="primary" type="submit" className="col-8 p-2 mx-auto mb-5 bg-white text-black rounded-5 mt-4">
        Alterar
      </Button>
    </LoginContainer>
  );
}
