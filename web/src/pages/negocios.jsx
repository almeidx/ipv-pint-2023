import "../styles/negocios.css";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { RxPlusCircled } from "react-icons/rx";
import useSWR from "swr";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";

export function Negocios() {
	const { isLoading, data } = useSWR(API_URL + "/negocios", fetcher);

	return (
		<>
			<NavBar page="negocios" />

			<main className="min-h-without-navbar bg-main pb-5">
				<Container className="col-11 row mx-auto gap-5 pt-4">
					<Card className="negocio-card negocio-add" style={{ width: "25rem", height: "23rem", borderRadius: "1rem" }}>
						<Card.Body className="d-flex flex-column">
							<Card.Title className="title mx-auto my-3" style={{ fontSize: "2rem" }}>
								Adicionar Negócio
							</Card.Title>
							<RxPlusCircled className="negocio-card-icon m-auto" size="7rem" />
						</Card.Body>
					</Card>

					{isLoading ? <Spinner /> : data.map((negocio) => <Negocio key={negocio.id} {...negocio} />)}
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
 * @param {Object} props.areaNegocio
 * @param {string} props.areaNegocio.name
 * @param {Object[]} props.contactos
 * @param {number} props.contactos.idContacto
 * @param {Object} props.contactos.contacto
 * @param {0|1} props.contactos.contacto.type
 * @param {string} props.contactos.contacto.value
 * @param {Object} props.centroTrabalho
 * @param {string} props.centroTrabalho.name
 * @param {Object} props.cliente
 * @param {string} props.cliente.name
 */
function Negocio({ title, description, areaNegocio, contactos, centroTrabalho, cliente }) {
	return (
		<Card className="negocio-card" style={{ width: "25rem", height: "23rem", borderRadius: "1rem" }}>
			<Card.Body>
				<Card.Title className="title my-3" style={{ fontSize: "2rem" }}>
					{title}
				</Card.Title>

				<hr />

				<Card.Text style={{ fontSize: "1.1rem" }}>
					<span className="fw-bold">{areaNegocio.name}</span> - {description}
				</Card.Text>

				<Card.Text style={{ fontSize: "1.1rem" }}>
					{" "}
					<span className="fw-bold"> Cliente -</span> {cliente.name}
				</Card.Text>

				<Card.Text style={{ fontSize: "1.1rem" }}>
					{" "}
					<span className="fw-bold"> Centro de Trabalho - </span> {centroTrabalho.name}
				</Card.Text>

				<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
					Contacto:
				</span>

				<ul>
					{contactos.map(({ idContacto, contacto }) => (
						<li key={idContacto} style={{ fontSize: "1.1rem" }}>
							<a
								className="text-black"
								style={{ listStyle: "none" }}
								href={`${contacto.type === 0 ? "mailto" : "tel"}:${contacto.value}`}
							>
								{contacto.value}
							</a>
						</li>
					))}
				</ul>
			</Card.Body>
		</Card>
	);
}
