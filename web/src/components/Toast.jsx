import CloseButton from "react-bootstrap/CloseButton";
import BootstrapToast from "react-bootstrap/Toast";

/**
 * @param {Object} props
 * @param {string} props.message
 * @param {boolean} props.show
 * @param {"success"|"error"} props.type
 * @param {() => void} props.hide
 */
export function Toast({ message, show, type, hide }) {
	return (
		<BootstrapToast
			className="position-fixed text-white"
			show={show}
			bg={type === "error" ? "danger" : "success"}
			onClose={() => hide()}
			style={{ bottom: "1rem", right: "1rem", minWidth: "20rem", zIndex: "9999" }}
		>
			<BootstrapToast.Body className="d-flex justify-content-between">
				<p className="mb-0">{message}</p>
				<CloseButton variant="white" onClick={() => hide()} />
			</BootstrapToast.Body>
		</BootstrapToast>
	);
}
