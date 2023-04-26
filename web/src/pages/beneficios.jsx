import { useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import useSWR from "swr";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { FaSpinner } from "react-icons/fa";

export function Beneficios() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(API_URL + "/beneficios", fetcher);

	const filteredBeneficios = search
		? data.filter(
				({ shortContent, content }) =>
					shortContent.toLowerCase().includes(search.toLowerCase()) ||
					content.toLowerCase().includes(search.toLowerCase()),
		  )
		: data ?? [];

	return (
		<>
			<NavBar page="beneficios" />

			<main className="min-h-without-navbar pb-5" style={{ backgroundColor: "#c5cae9" }}>
				<Container className="pt-5 col-11">
					<SearchBar placeholder="Pesquise por benefícios..." onSearch={(value) => setSearch(value)} />
				</Container>

				<Container className="pt-3 col-11 row mx-auto gap-5">
					{isLoading ? (
						<FaSpinner />
					) : filteredBeneficios.length ? (
						filteredBeneficios.map(({ id, ...beneficio }) => <Beneficio key={id} {...beneficio} />)
					) : (
						<p>Não encontrado</p>
					)}
				</Container>
			</main>

			<Footer />
		</>
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
					src={iconeBeneficio}
					height="110px"
					width="110px"
					className="rounded-circle"
					style={{ width: "110px" }}
				/>

				<Card.Title className="title my-3" style={{ fontSize: "2rem" }}>
					{shortContent}
				</Card.Title>

				<Card.Text style={{ fontSize: "1.1rem" }}>{content}</Card.Text>
			</Card.Body>
		</Card>
	);
}
