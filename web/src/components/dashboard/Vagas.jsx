import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { SearchBar } from "../SearchBar.jsx";
import { Spinner } from "../Spinner.jsx";

export default function Vagas() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(`${API_URL}/vagas?admin`, fetcher);

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
			<div className="d-flex justify-content-between mb-2">
				<h2>Vagas</h2>
				<IoMdAdd size={40} />
			</div>

			<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : (
					filtered.map(({ id, title, description, status, icon, public: public_, amountSlots }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`vaga-${id}`}>
							<div className="d-flex gap-2">
								<img src={icon} height="64" width="64" className="me-1" />

								<div>
									<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
										{id} - {title}
									</span>

									<p className="mb-0">{description || "Descrição"}</p>

									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										{statusToText(status)} - {public_ ? "Publica" : "Só para colaboradores"} - {amountSlots} vagas
									</p>
								</div>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
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
