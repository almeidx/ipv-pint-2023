import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

export function Error404() {
	return (
		<>
			<NavBar />

			<main className="min-h-without-navbar d-flex align-items-center bg-main pb-5">
				<Container className="vertical-center py-5 text-center">
					<h1>404</h1>

					<p>Página não encontrada.</p>

					<Link to="/" className="btn btn-light">
						Voltar para a página inicial
					</Link>
				</Container>
			</main>

			<Footer />
		</>
	);
}
