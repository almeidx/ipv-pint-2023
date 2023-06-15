import BootstrapSpinner from "react-bootstrap/Spinner";

/** @param {import("react").PropsWithoutRef<typeof BootstrapSpinner>} props */
export function Spinner(props) {
	return (
		<BootstrapSpinner animation="border" role="status" {...props}>
			<span className="visually-hidden">A carregar...</span>
		</BootstrapSpinner>
	);
}
