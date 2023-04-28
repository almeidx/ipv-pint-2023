import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { BiNotepad } from "react-icons/bi";
import { BsCalendarDate } from "react-icons/bs";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { SearchBar } from "../SearchBar.jsx";
import { FaSpinner } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

export default function Candidaturas() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/candidaturas", fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ vaga, utilizador }) =>
					vaga.title.toLowerCase().includes(search.toLowerCase()) ||
					utilizador.name.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	const formatter = new Intl.DateTimeFormat("pt-PT", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",

		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<Container className="py-4">
			<h2 className="mb-3">Candidaturas</h2>

			<SearchBar placeholder="Pesquise por candidaturas..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<FaSpinner />
				) : (
					filtered.map(({ id, submissionDate, refEmail, utilizador, vaga }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center">
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{id} - {utilizador.name}
								</span>

								<p className="mb-0">
									{formatter.format(new Date(submissionDate))} - {vaga.title}
								</p>
							</div>

							<div className="d-flex gap-2 justify-content-center align-items-center">
								<BiNotepad size={40} />
								<BsCalendarDate size={32} />
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}
