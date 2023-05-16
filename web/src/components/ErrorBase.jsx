import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { Page } from "./Page.jsx";

/**
 * @param {Object} props
 * @param {string} [props.header]
 * @param {string} props.title
 * @param {boolean} [props.showLogin]
 * @param {string} [props.page]
 */
export function ErrorBase({ header, title, showLogin, page }) {
	return (
		<Page className="min-h-without-navbar d-flex align-items-center bg-main pb-5" page={page}>
			<Container className="vertical-center py-5 text-center">
				{header ? <h1>{header}</h1> : null}

				<p>{title}</p>

				{showLogin ? (
					<Link to="/login" className="btn btn-light">
						Iniciar sessão
					</Link>
				) : (
					<Link to="/" className="btn btn-light">
						Volta à página inicial
					</Link>
				)}
			</Container>
		</Page>
	);
}
