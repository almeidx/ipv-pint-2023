import { AiFillEye } from "@react-icons/all-files/ai/AiFillEye";
import { AiFillEyeInvisible } from "@react-icons/all-files/ai/AiFillEyeInvisible";
import { MdAlternateEmail } from "@react-icons/all-files/md/MdAlternateEmail";
import { RiLockPasswordLine } from "@react-icons/all-files/ri/RiLockPasswordLine";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import { boolean, object, string } from "yup";
import { LoginContainer, SocialButtons } from "../components/LoginContainer.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { formikButtonDisabled } from "../utils/formikButtonDisabled.js";

const schema = object().shape({
	email: string().email("Email inválido").required("Email é obrigatório"),
	rememberMe: boolean(),
	password: string().required("Password é obrigatória"),
	// .min(12, "Password deve ter pelo menos 12 caracteres")
	// .max(128, "Password deve ter no máximo 128 caracteres")
	// .matches(/[a-z]/, "Password deve ter pelo menos uma letra minúscula")
	// .matches(/[A-Z]/, "Password deve ter pelo menos uma letra maiúscula")
	// .matches(/[0-9]/, "Password deve ter pelo menos um número")
	// .matches(/[^a-zA-Z0-9]/, "Password deve ter pelo menos um caracter especial"),
});

export default function Login() {
	const { setUser } = useUser();
	const navigate = useNavigate();
	const { showToast, toastMessage, hide, showToastWithMessage, toastType } = useToast();

	/** @param {import("yup").InferType<typeof schema>} data */
	async function handleSubmit({ email, password, rememberMe }) {
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
				try {
					const body = await response.json();
					if (typeof body === "object" && "provider" in body) {
						const { provider } = body;

						showToastWithMessage(
							`A sua conta foi criada através do ${provider}. Utilize o botão de login apropriado`,
							"error",
						);
						return;
					}
				} catch {}

				showToastWithMessage("Email ou password incorretos", "error");
				return;
			} else if (response.status === 403) {
				showToastWithMessage("A sua conta foi desativada por um administrador.", "error");
				return;
			}

			console.error(response);

			return;
		}

		const { user } = await response.json();

		if (rememberMe) {
			localStorage.setItem("auth-data", btoa(JSON.stringify({ email, password })));
		} else {
			localStorage.removeItem("auth-data");
		}

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

			showToastWithMessage("Foi enviado um email para recuperar a sua password");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao tentar recuperar a sua password", "error");
		}
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<Toast message={toastMessage} show={showToast} hide={hide} type={toastType} />

			<Formik
				validationSchema={schema}
				initialValues={{ email: "", password: "", rememberMe: false }}
				onSubmit={handleSubmit}
			>
				{({ handleSubmit, handleChange, handleBlur, values, touched, errors, setFieldValue, setFieldTouched }) => {
					const [showPassword, setShowPassword] = useState(false);

					useEffect(() => {
						const authData = localStorage.getItem("auth-data");
						if (!authData) return;

						const { email, password } = JSON.parse(atob(authData));

						(async () => {
							await setFieldValue("email", email);
							await setFieldValue("password", password);
							await setFieldValue("rememberMe", true);

							// formik sucks
							setTimeout(() => {
								setFieldTouched("email", true);

								setTimeout(() => {
									setFieldTouched("password", true);

									setTimeout(() => {
										setFieldTouched("rememberMe", true);
									});
								});
							});
						})();
					}, []);

					return (
						<Form
							noValidate
							onSubmit={handleSubmit}
							className="col-lg-5 col-xl-4 col-xxl-3 col-sm-8 col-11 col-md-7 d-flex flex-column px-md-5 rounded-5 px-4 py-4 text-white"
							style={{ backgroundColor: "rgba(8, 37, 139, 0.52)" }}
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
									type={showPassword ? "text" : "password"}
									onBlur={handleBlur}
									value={values.password}
									onChange={handleChange}
									isInvalid={touched.password && errors.password}
								/>
								<InputGroup.Text>
									<Button
										className="d-flex justify-content-center align-items-center border-0 bg-transparent p-0"
										onClick={() => setShowPassword((state) => !state)}
									>
										{showPassword ? (
											<AiFillEyeInvisible color="black" size={20} />
										) : (
											<AiFillEye color="black" size={20} />
										)}
									</Button>
								</InputGroup.Text>
								<Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
							</InputGroup>

							<Form.Group className="pb-3">
								<Button
									className="fst-italic text-decoration-none border-0 bg-transparent p-0 text-white"
									onClick={() => handleEsqueceuPassword(values.email)}
								>
									Esqueceu-se da password?
								</Button>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Check
									id="rememberMe"
									type="checkbox"
									label="Lembrar Password"
									onChange={handleChange}
									value={values.rememberMe}
									onBlur={handleBlur}
								/>
							</Form.Group>

							<Button
								variant="light"
								type="submit"
								className="col-8 col-xxl-9 rounded-5 mx-auto p-2"
								disabled={formikButtonDisabled(errors, touched)}
							>
								Login
							</Button>

							<SocialButtons />

							<Form.Group className="mx-auto">
								<Form.Text className="text-white">
									Ainda não tem uma conta?{" "}
									<Link className="text-white" to="/signup">
										Crie uma
									</Link>
								</Form.Text>
							</Form.Group>
						</Form>
					);
				}}
			</Formik>
		</LoginContainer>
	);
}
