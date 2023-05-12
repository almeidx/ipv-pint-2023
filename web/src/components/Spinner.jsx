import BootstrapSpinner from "react-bootstrap/Spinner";

export function Spinner(props) {
	return (
		<BootstrapSpinner animation="border" role="status" {...props}>
			<span className="visually-hidden">Loading...</span>
		</BootstrapSpinner>
	);
}
