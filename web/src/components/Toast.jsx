import CloseButton from "react-bootstrap/CloseButton";
import BootstrapToast from "react-bootstrap/Toast";

/**
 * @param {Object} props
 * @param {string} props.toastMessage
 * @param {boolean} props.showToast
 * @param {() => void} props.hide
 */
export function Toast({ toastMessage, showToast, hide }) {
	return (
		<BootstrapToast
			className="position-fixed text-white"
			show={showToast}
			bg="primary"
			onClose={() => hide()}
			style={{ bottom: "1rem", right: "1rem", minWidth: "20rem", zIndex: "9999" }}
		>
			<BootstrapToast.Body className="d-flex justify-content-between">
				<p className="mb-0">{toastMessage}</p>
				<CloseButton variant="white" onClick={() => hide()} />
			</BootstrapToast.Body>
		</BootstrapToast>
	);
}
