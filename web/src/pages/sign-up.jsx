import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { BsPerson } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { LoginContainer, SocialButtons } from "../components/LoginContainer.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

export function SignUp() {
	const { setUser } = useUser();

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();

		console.log(event);

		const name = event.target.elements.nome.value.trim();
		const surname = event.target.elements.apelido.value.trim();
		const email = event.target.elements.email.value.trim();
		const password = event.target.elements.password.value;
		const confirmPassword = event.target.elements["confirmar-password"].value;

		console.log({
			name,
			surname,
			email,
			password,
			confirmPassword,
		});

		if (password !== confirmPassword) {
			alert("As passwords não coincidem");
			return;
		}
		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				credentials: "include",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: `${name} ${surname}`, email, password, confirmPassword }),
			});

			if (!response.ok) {
				if (response.status === 400) {
					const data = await response.json();

					alert(data.message);
				}

				throw new Error("Something went wrong", { cause: response });
			}

			const data = await response.json();

			setUser(data.user);
		} catch (error) {
			console.error(error);

			alert(error.message);
		}
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<h1 className="title mb-5 text-white">Sign up</h1>

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

			<Button variant="light" type="submit" className="col-8 rounded-5 mx-auto mt-4 p-2">
				Criar conta
			</Button>

			<SocialButtons />

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
