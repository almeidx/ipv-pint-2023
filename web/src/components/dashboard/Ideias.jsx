import { useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { FaSpinner } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RiCheckFill, RiCloseFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { SearchBar } from "../SearchBar.jsx";

export default function Ideias() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/ideias", fetcher);

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-2">
				<h2>Ideias</h2>
				<Link to="/ideias">
					<IoMdAdd size={40} color="black" />
				</Link>
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
									{categoria} - {utilizador.name} - {formatDate(new Date(dataCriacao))}
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
