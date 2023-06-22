import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {() => void} props.onConfirm
 * @param {string} props.text
 * @param {string} props.title
 */
export function ConfirmModal({ show, onHide, onConfirm, text, title }) {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<p>{text}</p>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="primary" onClick={onConfirm}>
					Confirmar
				</Button>

				<Button variant="secondary" onClick={onHide}>
					Cancelar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
