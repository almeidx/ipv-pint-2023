import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { SearchBar } from "../SearchBar.jsx";
import { Spinner } from "../Spinner.jsx";

export default function Reuniões() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(`${API_URL}/reunioes`, fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ title, subject, description }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()) ||
					subject.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-2">
				<h2>Reuniões</h2>
				<IoMdAdd size={40} />
			</div>

			<SearchBar placeholder="Pesquise por reuniões..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : (
					filtered.map(({ id, startTime, duration, title, description, subject }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{id} - {title}: <span className="fw-normal">{subject}</span>
								</span>

								<p className="mb-2">{description}</p>

								<p className="mb-0" style={{ fontSize: "0.85rem" }}>
									{formatDate(new Date(startTime))} - {duration} minutos
								</p>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<RiPencilLine size={32} />
								<RiCloseFill size={32} color="red" />
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}
