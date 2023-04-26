import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { FaSpinner } from "react-icons/fa";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { SearchBar } from "../SearchBar.jsx";

export default function Reuniões() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/reunioes", fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ title, subject, description }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()) ||
					subject.toLowerCase().includes(search.toLowerCase()),
			),
		[(data, search)],
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
			<h2 className="mb-5">Reuniões</h2>

			<SearchBar placeholder="Pesquise por reuniões..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<FaSpinner />
				) : (
					filtered.map(({ id, startTime, duration, title, description, subject }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{id} - {title}: <span className="fw-normal">{subject}</span>
								</span>

								{/* <p className="mb-0 fw-bold" style={{ fontSize: "0.9rem" }}>
									Assunto: {subject}
								</p>
								*/}
								<p className="mb-3">{description}</p>

								<p className="mb-0" style={{ fontSize: "0.85rem" }}>
									{formatter.format(new Date(startTime))} - {duration} minutos
								</p>
							</div>

							<div className="d-flex gap-2 justify-content-center align-items-center">
								<RiPencilLine size={32} />
								<RiCloseFill size={32} />
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}
