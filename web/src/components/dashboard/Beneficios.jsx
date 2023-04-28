import { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { FaSpinner } from "react-icons/fa";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { SearchBar } from "../SearchBar.jsx";
import { IoMdAdd } from "react-icons/io";

export default function Beneficios() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/beneficios", fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ content, shortContent }) =>
					content.toLowerCase().includes(search.toLowerCase()) ||
					shortContent.toLowerCase().includes(search.toLowerCase()),
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
			<div className="d-flex justify-content-between mb-2">
				<h2>Benefícios</h2>
				<IoMdAdd size={40} />
			</div>

			<SearchBar placeholder="Pesquise por benefícios..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<FaSpinner />
				) : (
					filtered.map(({ id, dataValidade, content, shortContent, iconeBeneficio }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div className="d-flex gap-2">
								<img src={iconeBeneficio} height="65" width="65" className="me-2" />

								<div>
									<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
										{id} - {shortContent}
									</span>

									<p className="mb-0">{content}</p>

									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										{formatter.format(new Date(dataValidade))}
									</p>
								</div>
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
