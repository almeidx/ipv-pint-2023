import { useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import useSWR from "swr";
import { Page } from "../components/Page.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { resolveIcon } from "../utils/resolve-icon.js";

export default function Beneficios() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(`${API_URL}/beneficios`, fetcher);

	const filteredBeneficios = search
		? (data ?? []).filter(
				({ shortContent, content }) =>
					shortContent.toLowerCase().includes(search.toLowerCase()) ||
					content.toLowerCase().includes(search.toLowerCase()),
		  )
		: data ?? [];

	return (
		<Page page="/beneficios">
			<Container className="col-11 pt-5">
				<SearchBar placeholder="Pesquise por benefícios..." onSearch={(value) => setSearch(value)} />
			</Container>

			<Container className="col-11 row mx-auto gap-5 pt-3">
				{isLoading ? (
					<Spinner />
				) : filteredBeneficios.length ? (
					filteredBeneficios.map(({ id, ...beneficio }) => <Beneficio key={id} {...beneficio} />)
				) : (
					<p>Não encontrado</p>
				)}
			</Container>
		</Page>
	);
}

/**
 * @param {Object} props
 * @param {string} props.iconeBeneficio
 * @param {string} props.shortContent
 * @param {string} props.content
 */
function Beneficio({ iconeBeneficio, shortContent, content }) {
	return (
		<Card style={{ width: "18rem", height: "20rem", borderRadius: "1rem" }}>
			<Card.Body className="d-flex justify-content-center align-items-center flex-column">
				<Card.Img
					src={resolveIcon(iconeBeneficio)}
					height="110px"
					width="110px"
					className="rounded-circle"
					style={{ width: "110px" }}
					fetchpriority="high"
				/>

				<Card.Title className="title my-3" style={{ fontSize: "2rem" }}>
					{shortContent}
				</Card.Title>

				<Card.Text style={{ fontSize: "1.1rem" }}>{content}</Card.Text>
			</Card.Body>
		</Card>
	);
}
