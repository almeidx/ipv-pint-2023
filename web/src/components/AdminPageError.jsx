import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

export function AdminPageError({ error }) {
	console.error(error);

	if (error.status == 403) {
		return (
			<Container className="vertical-center py-5 text-center">
				<p>Não tem permissão para visualizar esta página</p>

				<Link to="/" className="btn btn-light">
					Volta à página inicial
				</Link>
			</Container>
		);
	}

	return (
		<Container className="py-4">
			<p>Ocorreu um erro ao carregar a página. Tente novamente</p>
		</Container>
	);
}
