import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { BiTrash } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";

export default function Mensagens() {
	const [search, setSearch] = useState("");
	const { data, isLoading } = useSWR(`${API_URL}/mensagens`, fetcher);

	const filtered = search
		? (data ?? []).filter(
				({ id, criador, content }) => id.includes(search) || criador.name.includes(search) || content.includes(search),
		  )
		: data ?? [];

	/** @param {number} id */
	function handleDelete(id) {}

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-2">
				<h2>Mensagens</h2>

				<Link to="/contacto">
					<IoMdAdd size={40} color="black" />
				</Link>
			</div>

			<SearchBar
				disabled={!data?.length}
				placeholder="Pesquise por mensagens..."
				onSearch={(value) => setSearch(value)}
			/>

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, createdAt, criador, content, registered }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`mensagem-${id}`}>
							<div>
								<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
									{id} - {criador.name}
								</span>

								<p className="mb-0">{content}</p>

								<p className="mb-0" style={{ fontSize: "0.85rem" }}>
									{registered ? `Utilizador registado - ${criador.name}` : `Sem registo - ${criador.email}`} -{" "}
									{formatDate(new Date(createdAt))}
								</p>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<Button onClick={() => handleDelete(id)} className="border-0 bg-transparent p-0">
									<BiTrash size={32} color="red" />
								</Button>
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Não foi encontrada nenhuma mensagem" : "Não há nenhuma mensagem registada"}</p>
				)}
			</ListGroup>
		</Container>
	);
}
