import React from "react";
import "../styles/Login.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { Google } from "../components/Google.jsx";
import { Facebook } from "../components/Facebook.jsx";
import { LoginContainer } from "../components/LoginContainer.jsx";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

export function Login() {
	/** @param {SubmitEvent} event */
	function handleSubmit(event) {
		event.preventDefault();

		console.log(event);
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<h1 className="text-white mb-5 title">Login</h1>

			<InputGroup className="col-12 mb-3">
				<InputGroup.Text id="email-icon">
					<MdAlternateEmail />
				</InputGroup.Text>
				<Form.Control placeholder="Email" aria-label="Email" aria-describedby="email-icon" id="email" />
			</InputGroup>

			<InputGroup className="col-12 mb-1">
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

			<Form.Group controlId="formBasicCheckbox" className="pb-3">
				<Link className="text-white fst-italic text-decoration-none" to="/mudar-password">
					Esqueceu-se da password?
				</Link>
			</Form.Group>

			<Form.Group className="mb-3" controlId="lembrar-password">
				<Form.Check type="checkbox" label="Lembrar Password" />
			</Form.Group>

			<Button variant="primary" type="submit" className="col-8 p-2 mx-auto mb-5 bg-white text-black rounded-5">
				Login
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
					Ainda não tem uma conta?{" "}
					<Link className="text-white" to="/signup">
						Crie uma
					</Link>
				</Form.Text>
			</Form.Group>
		</LoginContainer>
	);
}
