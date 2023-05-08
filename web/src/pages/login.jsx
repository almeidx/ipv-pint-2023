import "../styles/Login.css";

import { useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { Facebook } from "../components/icons/Facebook.jsx";
import { Google } from "../components/icons/Google.jsx";
import { LoginContainer } from "../components/LoginContainer.jsx";
import { UserContext } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

export function Login() {
	const { setUser } = useContext(UserContext);
	const navigate = useNavigate();

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();

		const email = event.target.elements.email.value;
		const password = event.target.elements.password.value;

		const response = await fetch(API_URL + "/auth/email", {
			credentials: "include",
			method: "POST",
			headers: {
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Origin": API_URL,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			alert("failed login");
			return;
		}

		const data = await response.json();

		setUser(data.user);

		navigate("/");
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<h1 className="title mb-5 text-white">Login</h1>

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
				<Link className="fst-italic text-decoration-none text-white" to="/mudar-password">
					Esqueceu-se da password?
				</Link>
			</Form.Group>

			<Form.Group className="mb-3" controlId="lembrar-password">
				<Form.Check type="checkbox" label="Lembrar Password" />
			</Form.Group>

			<Button variant="light" type="submit" className="col-8 rounded-5 mx-auto mb-5 p-2">
				Login
			</Button>

			<Form.Group className="d-flex justify-content-center mb-2 mt-3" controlId="formBasicCheckbox">
				<Button
					variant="light"
					type="submit"
					className="col-5 rounded-3 d-flex justify-content-center align-items-center mx-auto gap-2 p-2"
					onClick={() => {
						window.open(API_URL + "/auth/google", "_self");
					}}
				>
					<Google /> Google
				</Button>

				<Button
					variant="light"
					type="submit"
					className="col-5 rounded-3 d-flex justify-content-center align-items-center mx-auto gap-2"
					onClick={() => {
						window.open(API_URL + "/auth/facebook", "_self");
					}}
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
