import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { NavBar } from "../components/NavBar.jsx";
import { Footer } from "../components/Footer.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import useSWR from "swr";

export function Negocios() {
	const { isLoading, data } = useSWR(API_URL + "/negocios", fetcher);

	// const filteredNegocios = search
	// 	? data.filter((negocio) => {
	// 			const title = negocio.title.toLowerCase();
	// 			const description = negocio.description.toLowerCase();

	// 			return title.includes(search.toLowerCase()) || description.includes(search.toLowerCase());
	// 	  })
	// 	: data;

	const filteredNegocios = data ?? [];

	return (
		<>
			<NavBar page="negocios" />

			<main className="min-h-without-navbar pb-5" style={{ backgroundColor: "#c5cae9" }}>
				<Container className="col-11 pt-4 row mx-auto gap-5">
					{filteredNegocios.map((negocio) => (
						<Negocio key={negocio.id} {...negocio} />
					))}
				</Container>
			</main>

			<Footer />
		</>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.area
 * @param {string} props.contactos
 */

function Negocio({ title, description, areaNegocio, contactos }) {
	return (
		<Card style={{ width: "18rem", height: "15rem", borderRadius: "1rem" }}>
			<Card.Body>
				<Card.Title className="title my-3" style={{ fontSize: "2rem" }}>
					{title}
				</Card.Title>

				<Card.Text style={{ fontSize: "1.1rem" }}>
					{areaNegocio.name} - {description}
				</Card.Text>

				<Card.Text style={{ fontSize: "1.1rem" }}>
					Contactos:
					<ul>
						{contactos.map(({ idContacto, contacto }) => (
							<li key={idContacto}>
								<a href={`${contacto.type === 0 ? "mailto" : "tel"}:${contacto.value}`}>{contacto.value}</a>
							</li>
						))}
					</ul>
				</Card.Text>
			</Card.Body>
		</Card>
	);
}
