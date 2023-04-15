import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { SearchBar } from "../SearchBar.jsx";
import { useEffect, useState } from "react";
import { BsCalendarDate } from "react-icons/bs";
import { BiNotepad } from "react-icons/bi";
import { API_URL } from "../../utils/constants.js";

export default function Candidaturas() {
	const [search, setSearch] = useState("");
	const [candidaturas, setCandidaturas] = useState([]);

	useEffect(() => {
		fetch(API_URL + "/candidaturas")
			.then((res) => res.json())
			.then((data) => setCandidaturas(data));
	}, []);

	const formatter = new Intl.DateTimeFormat("pt-PT", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",

		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<Container className="py-4">
			<h2 className="mb-5">Candidaturas</h2>

			<SearchBar placeholder="Pesquise por candidaturas..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{candidaturas.map(({ id, submissionDate, refEmail, utilizador, vaga }) => (
					<ListGroup.Item className="d-flex justify-content-between align-items-center">
						<div>
							<span className="fw-bold">
								{id} - {utilizador.name}
							</span>

							<p>
								{formatter.format(new Date(submissionDate))} - {vaga.title}
							</p>
						</div>

						<div className="d-flex gap-2 justify-content-center align-items-center">
							<BiNotepad size={40} />
							<BsCalendarDate size={32} />
						</div>
					</ListGroup.Item>
				))}
			</ListGroup>
		</Container>
	);
}
