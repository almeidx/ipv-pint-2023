import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { LoginContainer, SocialButtons } from "../components/LoginContainer.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

const schema = object().shape({
	email: string().email("Email inválido").required("Email é obrigatório"),
	password: string().required("Password é obrigatória"),
	// .min(16, "Password deve ter pelo menos 16 caracteres")
	// .max(128, "Password deve ter no máximo 128 caracteres")
	// .matches(/[a-z]/, "Password deve ter pelo menos uma letra minúscula")
	// .matches(/[A-Z]/, "Password deve ter pelo menos uma letra maiúscula")
	// .matches(/[0-9]/, "Password deve ter pelo menos um número")
	// .matches(/[^a-zA-Z0-9]/, "Password deve ter pelo menos um caracter especial"),
});

export function Login() {
	const { setUser } = useUser();
	const navigate = useNavigate();
	const { showToast, toastMessage, toggleToast, showToastWithMessage, toastType } = useToast();

	/**
	 * @param {import("yup").InferType<typeof schema>} data
	 */
	async function handleSubmit({ email, password }) {
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
				showToastWithMessage("Email ou password incorretos", "error");
			}

			console.error(response);

			return;
		}

		const { user } = await response.json();

		setUser(user);

		navigate("/");
	}

	/** @param {string} email */
	async function handleEsqueceuPassword(email) {
		if (!email) {
			showToastWithMessage("Preencha o seu email", "error");
			return;
		}

		try {
			const response = await fetch(`${API_URL}/utilizadores/esqueceu-password`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				if (response.status === 404) {
					showToastWithMessage("Conta não encontrada", "error");
					return;
				}

				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Foi enviado um email para recuperar a sua password", "success");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao tentar recuperar a sua password", "error");
		}
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<Toast message={toastMessage} show={showToast} hide={() => toggleToast(false)} type={toastType} />

			<Formik validationSchema={schema} initialValues={{ email: "", password: "" }} onSubmit={handleSubmit}>
				{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
					<Form
						noValidate
						onSubmit={handleSubmit}
						className="col-lg-3 col-sm-7 col-10 col-md-5 form d-flex flex-column"
					>
						<h1 className="title mb-5 text-white">Login</h1>

						<InputGroup className="col-12 mb-3" hasValidation>
							<InputGroup.Text id="email-icon">
								<MdAlternateEmail />
							</InputGroup.Text>
							<Form.Control
								placeholder="Email"
								aria-label="Email"
								aria-describedby="email-icon"
								id="email"
								type="email"
								onBlur={handleBlur}
								value={values.email}
								onChange={handleChange}
								isInvalid={touched.email && errors.email}
							/>
							<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
						</InputGroup>

						<InputGroup className="col-12 mb-1" hasValidation>
							<InputGroup.Text id="password-icon">
								<RiLockPasswordLine />
							</InputGroup.Text>
							<Form.Control
								placeholder="Password"
								aria-label="Password"
								aria-describedby="password-icon"
								id="password"
								type="password"
								onBlur={handleBlur}
								value={values.password}
								onChange={handleChange}
								isInvalid={touched.password && errors.password}
							/>
							<Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
						</InputGroup>

						<Form.Group controlId="formBasicCheckbox" className="pb-3">
							<Button
								className="fst-italic text-decoration-none border-0 bg-transparent p-0 text-white"
								onClick={() => handleEsqueceuPassword(values.email)}
							>
								Esqueceu-se da password?
							</Button>
						</Form.Group>

						<Form.Group className="mb-3" controlId="lembrar-password">
							<Form.Check type="checkbox" label="Lembrar Password" />
						</Form.Group>

						<Button
							variant="light"
							type="submit"
							className="col-8 rounded-5 mx-auto p-2"
							disabled={Object.keys(errors).length > 0}
						>
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
					</Form>
				)}
			</Formik>
		</LoginContainer>
	);
}
