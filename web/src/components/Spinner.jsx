import { Spinner as BootstrapSpinner } from "react-bootstrap";

export function Spinner(props) {
	return (
		<BootstrapSpinner animation="border" role="status" {...props}>
			<span className="visually-hidden">Loading...</span>
		</BootstrapSpinner>
	);
}
