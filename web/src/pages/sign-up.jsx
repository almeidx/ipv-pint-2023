import { AiFillEye } from "@react-icons/all-files/ai/AiFillEye";
import { AiFillEyeInvisible } from "@react-icons/all-files/ai/AiFillEyeInvisible";
import { BsPerson } from "@react-icons/all-files/bs/BsPerson";
import { MdAlternateEmail } from "@react-icons/all-files/md/MdAlternateEmail";
import { RiLockPasswordLine } from "@react-icons/all-files/ri/RiLockPasswordLine";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { LoginContainer, SocialButtons } from "../components/LoginContainer.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useQuery } from "../hooks/useQuery.jsx";
import { API_URL } from "../utils/constants.js";
import { formikButtonDisabled } from "../utils/formikButtonDisabled.js";

const schema = object().shape({
	nome: string().required("Nome é obrigatório"),
	apelido: string().required("Apelido é obrigatório"),
	email: string().email("Email inválido").required("Email é obrigatório"),
	password: string()
		.required("Password é obrigatória")
		.min(12, "Password deve ter pelo menos 12 caracteres")
		.max(128, "Password deve ter no máximo 128 caracteres")
		.matches(/[a-z]/, "Password deve ter pelo menos uma letra minúscula")
		.matches(/[A-Z]/, "Password deve ter pelo menos uma letra maiúscula")
		.matches(/[0-9]/, "Password deve ter pelo menos um número")
		.matches(/[^a-zA-Z0-9]/, "Password deve ter pelo menos um caracter especial"),
	confirmPassword: string().required("Password é obrigatória"),
});

export default function SignUp() {
	const query = useQuery();
	const { showToast, showToastWithMessage, toastMessage, hide, toastType } = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		if (query.has("fail")) {
			showToastWithMessage("O email já está em uso", "error");
		}
	}, []);

	/** @param {import("yup").InferType<typeof schema>} data */
	async function handleSubmit({ nome, apelido, email, password, confirmPassword }) {
		if (password !== confirmPassword) {
			showToastWithMessage("As passwords não coincidem", "error");
			return;
		}

		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				credentials: "include",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: `${nome} ${apelido}`, email, password, confirmPassword }),
			});

			if (!response.ok) {
				if (response.status === 409) {
					showToastWithMessage("O email introduzido já está em uso", "error");
					return;
				}

				if (response.status === 400) {
					const data = await response.json();

					alert(data.message);
				}

				throw new Error("Something went wrong", { cause: response });
			}

			const { userId } = await response.json();

			localStorage.setItem("pending", JSON.stringify({ email, userId }));

			navigate("/verificar-conta");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar a sua conta", "error");
		}
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<Toast message={toastMessage} show={showToast} hide={hide} type={toastType} />

			<Formik
				validationSchema={schema}
				initialValues={{ nome: "", apelido: "", email: "", password: "", confirmPassword: "" }}
				onSubmit={handleSubmit}
			>
				{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => {
					const [showPassword, setShowPassword] = useState(false);

					return (
						<Form
							noValidate
							onSubmit={handleSubmit}
							className="col-lg-5 col-xl-4 col-xxl-3 col-sm-8 col-11 col-md-7 d-flex flex-column px-md-5 rounded-5 px-4 py-4 text-white"
							style={{ backgroundColor: "rgba(8, 37, 139, 0.52)" }}
						>
							<h1 className="title mb-5 text-white">Sign up</h1>

							<InputGroup className="col-12 mb-3" hasValidation>
								<InputGroup.Text id="nome-icon">
									<BsPerson />
								</InputGroup.Text>
								<Form.Control
									placeholder="Nome"
									aria-label="Nome"
									aria-describedby="nome-icon"
									id="nome"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.nome}
									isInvalid={touched.nome && errors.nome}
								/>
								<Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
							</InputGroup>

							<InputGroup className="col-12 mb-3" hasValidation>
								<InputGroup.Text id="apelido-icon">
									<BsPerson />
								</InputGroup.Text>
								<Form.Control
									placeholder="Apelido"
									aria-label="Apelido"
									aria-describedby="apelido-icon"
									id="apelido"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.apelido}
									isInvalid={touched.apelido && errors.apelido}
								/>
								<Form.Control.Feedback type="invalid">{errors.apelido}</Form.Control.Feedback>
							</InputGroup>

							<InputGroup className="col-12 mb-3" hasValidation>
								<InputGroup.Text id="email-icon">
									<MdAlternateEmail />
								</InputGroup.Text>
								<Form.Control
									placeholder="Email"
									aria-label="Email"
									aria-describedby="email-icon"
									id="email"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.email}
									isInvalid={touched.email && errors.email}
								/>
								<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
							</InputGroup>

							<InputGroup className="col-12 mb-3" hasValidation>
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
									onChange={handleChange}
									value={values.password}
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

							<InputGroup className="col-12" hasValidation>
								<InputGroup.Text id="confirmar-password-icon">
									<RiLockPasswordLine />
								</InputGroup.Text>
								<Form.Control
									placeholder="Confirmar password"
									aria-label="Confirmar password"
									aria-describedby="confirmar-password-icon"
									id="confirmPassword"
									type={showPassword ? "text" : "password"}
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.confirmPassword}
									isInvalid={touched.confirmPassword && errors.confirmPassword}
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
								<Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
							</InputGroup>

							<Button
								variant="light"
								type="submit"
								className="col-8 rounded-5 mx-auto mt-4 p-2"
								disabled={formikButtonDisabled(errors, touched)}
							>
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
						</Form>
					);
				}}
			</Formik>
		</LoginContainer>
	);
}
