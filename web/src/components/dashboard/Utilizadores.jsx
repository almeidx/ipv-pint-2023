import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { BiNoEntry } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import { RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { SearchBar } from "../SearchBar.jsx";
import { IoMdAdd } from "react-icons/io";

const tiposUtilizador = [
	"Utilizador",
	"Gestor de Ideias",
	"Gestor de Recursos Humanos",
	"Gestor de Negocios",
	"Administrador",
];

export default function Reuniões() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/utilizadores", fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ name, email }) =>
					name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase()),
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
			<h2 className="mb-3">Utilizadores</h2>

			<SearchBar placeholder="Pesquise por utilizadores..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<FaSpinner />
				) : (
					filtered.map(({ id, idTipoUser, name, email, lastLoginDate }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{id} - {name}
								</span>

								<p className="mb-0" style={{ fontSize: "1rem" }}>
									{email}
								</p>

								<p className="mb-0" style={{ fontSize: "0.90rem" }}>
									Tipo de utilizador: <span className="fw-bold">{tiposUtilizador[idTipoUser - 1]}</span>
								</p>

								{lastLoginDate ? (
									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										Ultimo login: {formatter.format(new Date(lastLoginDate))}
									</p>
								) : null}
							</div>

							<div className="d-flex gap-2 justify-content-center align-items-center">
								<RiPencilLine size={32} />
								<BiNoEntry size={32} />
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}
