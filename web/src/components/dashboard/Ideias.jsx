import { useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { SearchBar } from "../SearchBar.jsx";
import { FaSpinner } from "react-icons/fa";
import { RiCheckFill, RiCloseFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";

export default function Ideias() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/ideias", fetcher);

	const formatter = new Intl.DateTimeFormat("pt-PT", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",

		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between">
				<h2 className="mb-5">Ideias</h2>
				<IoMdAdd size={40} />
			</div>

			<SearchBar placeholder="Pesquise por ideias..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<FaSpinner />
				) : (
					data.map(({ id, dataCriacao, categoria, utilizador, content }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center">
							<div>
								<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
									{id} - {content}
								</span>

								<p className="mb-0">
									{categoria} - {utilizador.name} - {formatter.format(new Date(dataCriacao))}
								</p>
							</div>

							<div className="d-flex gap-2 justify-content-center align-items-center">
								<RiCheckFill size={32} color="green" />
								<RiCloseFill size={32} color="red" />
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}
