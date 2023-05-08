import "../styles/Login.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { RiLockPasswordLine } from "react-icons/ri";
import { LoginContainer } from "../components/LoginContainer.jsx";

export function VerificarConta() {
	/** @param {SubmitEvent} event */
	function handleSubmit(event) {
		event.preventDefault();

		console.log(event);
	}

	return (
		<LoginContainer handleSubmit={handleSubmit}>
			<h1 className="title mb-4 text-white" style={{ fontSize: "3rem" }}>
				Verificar Conta
			</h1>

			<Form.Group>
				<Form.Text className="text-white">
					Foi enviado um código para o seu email abc@abc.com. Por favor, introduza-o abaixo. O código irá expirar em 5
					minutos.
				</Form.Text>
			</Form.Group>

			<InputGroup className="my-5">
				<InputGroup.Text id="code-icon">
					<RiLockPasswordLine />
				</InputGroup.Text>
				<Form.Control placeholder="Código" aria-label="Código" aria-describedby="code-icon" />
			</InputGroup>

			<Form.Group className="d-flex justify-content-around mb-2 mt-3" controlId="">
				<Button variant="light" type="submit" className="col-5 rounded-5">
					Submeter
				</Button>

				<Button variant="light" type="submit" className="col-5 rounded-5">
					Re-enviar
				</Button>
			</Form.Group>
		</LoginContainer>
	);
}
