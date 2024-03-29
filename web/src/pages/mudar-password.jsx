import { AiFillEye } from "@react-icons/all-files/ai/AiFillEye";
import { AiFillEyeInvisible } from "@react-icons/all-files/ai/AiFillEyeInvisible";
import { HiOutlineArrowLeft } from "@react-icons/all-files/hi/HiOutlineArrowLeft";
import { RiLockPasswordLine } from "@react-icons/all-files/ri/RiLockPasswordLine";
import { Formik } from "formik";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import { object, ref, string } from "yup";
import { LoginContainer } from "../components/LoginContainer.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useQuery } from "../hooks/useQuery.jsx";
import { API_URL } from "../utils/constants.js";
import { formikButtonDisabled } from "../utils/formikButtonDisabled.js";

const schema = object().shape({
	password: string()
		.required("Password é obrigatória")
		.min(12, "Password deve ter pelo menos 12 caracteres")
		.max(128, "Password deve ter no máximo 128 caracteres")
		.matches(/[a-z]/, "Password deve ter pelo menos uma letra minúscula")
		.matches(/[A-Z]/, "Password deve ter pelo menos uma letra maiúscula")
		.matches(/[0-9]/, "Password deve ter pelo menos um número")
		.matches(/[^a-zA-Z0-9]/, "Password deve ter pelo menos um caracter especial"),
	confirmPassword: string()
		.required("Confirmação da password é obrigatória")
		.oneOf([ref("password"), null], "As passwords não coincidem"),
});

export default function MudarPassword() {
	const query = useQuery();
	const { showToast, showToastWithMessage, toastMessage, toastType, hide } = useToast();
	const navigate = useNavigate();

	/** @param {import("yup").InferType<typeof schema>} data */
	async function handleSubmit({ password }) {
		const id = query.get("id");
		const code = query.get("code");

		if (!id || !code) {
			showToastWithMessage("Há dados em falta. Por favor, abra o URL enviado no email novamente.", "error");
			return;
		}

		try {
			const response = await fetch(`${API_URL}/utilizadores/${id}/esqueceu-password`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code, password }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Password alterada com sucesso!");

			setTimeout(() => {
				navigate("/login");
			}, 5_000);
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao mudar a password. Por favor, tente novamente.", "error");
		}
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<Toast show={showToast} hide={hide} message={toastMessage} type={toastType} />

			<Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={{ password: "", confirmPassword: "" }}>
				{({ handleSubmit, handleChange, handleBlur, errors, touched, values }) => {
					const [showPassword, setShowPassword] = useState(false);

					return (
						<Form
							noValidate
							onSubmit={handleSubmit}
							className="col-lg-5 col-xl-4 col-xxl-3 col-sm-8 col-11 col-md-7 d-flex flex-column px-md-5 rounded-5 px-4 py-4 text-white"
							style={{ backgroundColor: "rgba(8, 37, 139, 0.52)" }}
						>
							<div className="d-flex align-items-center mb-5 gap-1">
								<Link to="/">
									<HiOutlineArrowLeft size={32} color="white" />
								</Link>

								<h1 className="title text-white" style={{ fontSize: "2rem" }}>
									Mudar Password
								</h1>
							</div>

							<InputGroup className="col-12 mb-3" hasValidation>
								<InputGroup.Text id="password-icon">
									<RiLockPasswordLine />
								</InputGroup.Text>
								<Form.Control
									placeholder="Password"
									aria-label="Nova password"
									aria-describedby="password-icon"
									id="password"
									type={showPassword ? "text" : "password"}
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.password && !!errors.password}
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

							<InputGroup className="col-12 mb-3" hasValidation>
								<InputGroup.Text id="confirmar-password-icon">
									<RiLockPasswordLine />
								</InputGroup.Text>
								<Form.Control
									placeholder="Confirmar Password"
									aria-label="Confirmar Password"
									aria-describedby="confirmar-password-icon"
									id="confirmPassword"
									type={showPassword ? "text" : "password"}
									value={values.confirmPassword}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.confirmPassword && !!errors.confirmPassword}
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
								className="col-8 rounded-5 mx-auto mt-3 p-2"
								disabled={formikButtonDisabled(errors, touched)}
							>
								Alterar
							</Button>
						</Form>
					);
				}}
			</Formik>
		</LoginContainer>
	);
}
