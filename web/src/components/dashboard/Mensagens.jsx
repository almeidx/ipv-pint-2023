import { useState } from "react";
import { Spinner } from "../Spinner.jsx";
import { SearchBar } from "../SearchBar.jsx";
import { BiTrash } from "react-icons/bi";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import useSWR from "swr";

export default function Mensagens() {
	const [search, setSearch] = useState("");
	const { data, isLoading } = useSWR(API_URL + "/mensagens", fetcher);

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
					filtered.map(({ id, dataCriacao, criador, content, registered }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center">
							<div>
								<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
									{id} - {criador.name}
								</span>

								<p>{content}</p>

								<p className="mb-0">
									{registered ? "Utilizador registado" : "Sem registo"} - {criador.email} -{" "}
									{formatDate(new Date(dataCriacao))}
								</p>
							</div>

							<div className="d-flex gap-2 justify-content-center align-items-center">
								<Button onClick={() => handleDelete(id)} className="bg-transparent border-0">
									<BiTrash size={32} color="red" />
								</Button>
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Pesquisa não retornou nenhuma mensagem" : "Não há nenhuma mensagem guardada"}</p>
				)}
			</ListGroup>
		</Container>
	);
}
