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

			<main className="min-h-without-navbar pb-5 bg-main">
				<Container className="col-11 pt-4 row mx-auto gap-5">
					<Card className="negocio-card negocio-add" style={{ width: "25rem", height: "23rem", borderRadius: "1rem" }}>
						<Card.Body className="d-flex" style={{ flexDirection: "column" }}>
							<Card.Title className="title my-3 mx-auto" style={{ fontSize: "2rem" }}>
								Adicionar Negócio
							</Card.Title>
							<RxPlusCircled className="m-auto negocio-card-icon" size="7rem" />
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
 * @param {string} props.area
 * @param {string} props.contactos
 */

function Negocio({ title, description, areaNegocio, contactos, centroTrabalho, cliente, funcionarioResponsavel }) {
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

				<Card.Text style={{ fontSize: "1.1rem" }}>
					<span className="fw-bold"> Funcionário Responsável - </span> {funcionarioResponsavel.name}
				</Card.Text>

				<Card.Text style={{ fontSize: "1.1rem" }}>
					<span className="fw-bold"> Contacto: </span>
					<ul>
						{contactos.map(({ idContacto, contacto }) => (
							<li key={idContacto}>
								<a
									style={{ color: "black", listStyle: "none" }}
									href={`${contacto.type === 0 ? "mailto" : "tel"}:${contacto.value}`}
								>
									{contacto.value}
								</a>
							</li>
						))}
					</ul>
				</Card.Text>
			</Card.Body>
		</Card>
	);
}
