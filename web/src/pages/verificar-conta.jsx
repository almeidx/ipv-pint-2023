import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { LoginContainer } from "../components/LoginContainer.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

export function VerificarConta() {
	const [pendingData, setPendingData] = useState(null);
	const { setUser } = useUser();
	const navigate = useNavigate();
	const { showToast, showToastWithMessage, toastMessage, toastType, toggleToast } = useToast();

	useEffect(() => {
		const pending = localStorage.getItem("pending");

		if (pending) {
			const data = JSON.parse(pending);
			setPendingData(data);
		}
	}, []);

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();

		const confirmCode = event.target.elements.confirmCode.value;

		console.log({ userId: pendingData.userId, confirmCode });

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

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<Toast message={toastMessage} type={toastType} show={showToast} onClose={toggleToast} />

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
				/>
			</InputGroup>

			<Form.Group className="d-flex justify-content-around mb-2 mt-3" controlId="">
				<Button variant="light" type="submit" className="col-5 rounded-5" disabled={!pendingData}>
					Submeter
				</Button>

				<Button variant="light" type="submit" className="col-5 rounded-5">
					Re-enviar
				</Button>
			</Form.Group>
		</LoginContainer>
	);
}
