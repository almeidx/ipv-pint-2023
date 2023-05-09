import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { Footer } from "./Footer.jsx";
import { NavBar } from "./NavBar.jsx";

/**
 * @param {Object} props
 * @param {string} [props.header]
 * @param {string} props.title
 */
export function ErrorBase({ header, title }) {
	return (
		<>
			<NavBar />

			<main className="min-h-without-navbar d-flex align-items-center bg-main pb-5">
				<Container className="vertical-center py-5 text-center">
					{header ? <h1>{header}</h1> : null}

					<p>{title}</p>

					<Link to="/" className="btn btn-light">
						Volta à página inicial
					</Link>
				</Container>
			</main>

			<Footer />
		</>
	);
}
