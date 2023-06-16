import { RiLockPasswordLine } from "@react-icons/all-files/ri/RiLockPasswordLine";
import { Formik } from "formik";
import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { LoginContainer } from "../components/LoginContainer.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { formikButtonDisabled } from "../utils/formikButtonDisabled.js";

const schema = object().shape({
	confirmCode: string()
		.required("Código de verificação é obrigatório")
		.length(12, "Código de verificação deve ter 12 caracteres"),
});

export default function VerificarConta() {
	const [pendingData, setPendingData] = useState(null);
	const { setUser } = useUser();
	const navigate = useNavigate();
	const { showToast, showToastWithMessage, toastMessage, toastType, toggleToast } = useToast();
	const [reenviarDisabled, setReenviarDisabled] = useState(false);
	const timeoutRef = useRef(null);

	useEffect(() => {
		const pending = localStorage.getItem("pending");

		if (pending) {
			const data = JSON.parse(pending);
			setPendingData(data);
		}
	}, []);

	/** @param {import("yup").InferType<typeof schema>} data */
	async function handleSubmit({ confirmCode }) {
		if (!pendingData) return;

		try {
			const response = await fetch(`${API_URL}/auth/validate`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: pendingData.userId, confirmCode }),
			});

			if (!response.ok) {
				if (response.status === 401) {
					showToastWithMessage("Código de verificação incorreto", "error");
					return;
				}

				throw new Error("Something went wrong", { cause: response });
			}

			localStorage.removeItem("pending");

			const { user } = await response.json();
			setUser(user);

			navigate("/profile");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao validar a conta", "error");
		}
	}

	async function handleReenviar() {
		if (!pendingData) return;

		try {
			setReenviarDisabled(true);

			const response = await fetch(`${API_URL}/auth/validate/retry`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: pendingData.userId }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Código reenviado com sucesso", "success");

			timeoutRef.current = setTimeout(() => {
				setReenviarDisabled(false);
				timeoutRef.current = null;
			}, 60_000);
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao reenviar o código", "error");

			setReenviarDisabled(false);
		}
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<Toast message={toastMessage} type={toastType} show={showToast} onClose={toggleToast} />

			<Formik validationSchema={schema} initialValues={{ confirmCode: "" }} onSubmit={handleSubmit}>
				{({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
					<Form
						noValidate
						onSubmit={handleSubmit}
						className="col-lg-3 col-sm-7 col-10 col-md-5 form d-flex flex-column"
					>
						<h1 className="title mb-4 text-white" style={{ fontSize: "3rem" }}>
							Verificar Conta
						</h1>

						<Form.Group>
							<Form.Text className="text-white">
								Foi enviado um código para o seu email{pendingData?.email ? ` ${pendingData.email}` : ""}. Por favor,
								introduza-o abaixo. O código irá expirar em 5 minutos.
							</Form.Text>
						</Form.Group>

						<InputGroup className="my-5">
							<InputGroup.Text id="code-icon">
								<RiLockPasswordLine />
							</InputGroup.Text>
							<Form.Control
								id="confirmCode"
								placeholder="Código"
								aria-label="Código"
								aria-describedby="code-icon"
								disabled={!pendingData}
								value={values.confirmCode}
								onChange={handleChange}
								onBlur={handleBlur}
								isInvalid={touched.confirmCode && !errors.confirmCode}
							/>
							<Form.Control.Feedback type="invalid">{errors.confirmCode}</Form.Control.Feedback>
						</InputGroup>

						<Form.Group className="d-flex justify-content-around mb-2 mt-3" controlId="">
							<Button
								variant="light"
								type="submit"
								className="col-5 rounded-5"
								disabled={!pendingData || formikButtonDisabled(errors, touched)}
							>
								Submeter
							</Button>

							<Button
								variant="light"
								type="button"
								className="col-5 rounded-5"
								onClick={handleReenviar}
								disabled={!pendingData || reenviarDisabled}
							>
								Re-enviar
							</Button>
						</Form.Group>
					</Form>
				)}
			</Formik>
		</LoginContainer>
	);
}
