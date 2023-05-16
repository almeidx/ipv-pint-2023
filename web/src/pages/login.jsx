import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { LoginContainer, SocialButtons } from "../components/LoginContainer.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

export function Login() {
	const { setUser } = useUser();
	const navigate = useNavigate();
	const { showToast, toastMessage, toggleToast, showToastWithMessage } = useToast();

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();

		const email = event.target.elements.email.value;
		const password = event.target.elements.password.value;

		const response = await fetch(`${API_URL}/auth/email`, {
			credentials: "include",
			method: "POST",
			headers: {
				"Allow-Control-Allow-Origin": API_URL,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			if (response.status === 401) {
				showToastWithMessage("Email ou password incorretos");
			}

			console.error(response);

			return;
		}

		const data = await response.json();

		setUser(data.user);

		navigate("/");
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<h1 className="title mb-5 text-white">Login</h1>

			<Toast toastMessage={toastMessage} showToast={showToast} hide={() => toggleToast(false)} />

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

			<Button variant="light" type="submit" className="col-8 rounded-5 mx-auto p-2">
				Login
			</Button>

			<SocialButtons />

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
