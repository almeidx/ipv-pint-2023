import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { FaSpinner } from "react-icons/fa";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { SearchBar } from "../SearchBar.jsx";

export default function Vagas() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/vagas", fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ title, description }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	return (
		<Container className="py-4">
			<h2 className="mb-5">Vagas</h2>

			<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<FaSpinner />
				) : (
					filtered.map(({ id, title, description, status, icon, public: public_, amountSlots }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center">
							<div className="d-flex gap-2">
								<img src={icon} height="64" width="64" className="me-1" />

								<div>
									<span className="fw-bold text-wrap">
										{id} - {title}
									</span>

									<p className="mb-0">{description || "Descrição"}</p>

									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										{statusToText(status)} - {public_ ? "Publica" : "Só para colaboradores"} - {amountSlots} vagas
									</p>

									<p className="mb-0">{/* {formatter.format(new Date(dataCriacao))} */}</p>
								</div>
							</div>

							<div className="d-flex gap-2 justify-content-center align-items-center">
								<RiPencilLine size={32} />
								<RiCloseFill size={40} color="red" />
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}

/**
 * @param {number} status
 */
function statusToText(status) {
	switch (status) {
		case 0:
			return "Aberta";
		case 1:
			return "Fechada";
		default:
			return "Desconhecido";
	}
}
