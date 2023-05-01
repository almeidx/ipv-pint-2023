import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

export function Error404() {
	return (
		<>
			<NavBar />

			<main className="min-h-without-navbar pb-5 d-flex align-items-center" style={{ backgroundColor: "#c5cae9" }}>
				<Container className="py-5 text-center vertical-center">
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
