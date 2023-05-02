import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";
import useSWR from "swr";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { Spinner } from "../components/Spinner.jsx";

export function Vagas() {
	const [search, setSearch] = useState("");
	const [vagasCheias, setVagasCheias] = useState(false);
	const { data, isLoading } = useSWR(API_URL + "/vagas", fetcher);

	const filteredVagas = search
		? (data ?? []).filter(
				(vaga) =>
					vaga.title.toLowerCase().includes(search.toLowerCase()) || vaga.description.includes(search.toLowerCase()),
		  )
		: data ?? [];

	return (
		<>
			<NavBar page="vagas" />

			<main className="min-h-without-navbar pb-5 " style={{ backgroundColor: "#c5cae9" }}>
				<Container className="pt-5 col-11">
					<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />

					<FormCheck
						type="checkbox"
						label="Mostrar vagas cheias"
						checked={vagasCheias}
						onChange={() => setVagasCheias((state) => !state)}
						style={{ width: "fit-content" }}
						className="ps-5 pe-3 py-2 rounded-pill mt-4 bg-white"
						id="vagasCheias"
					/>
				</Container>

				<Container className="col-12 pt-4 row mx-auto gap-5 d-flex">
					{isLoading ? <Spinner /> : filteredVagas.map(({ id, ...vaga }) => <Vaga key={id} {...vaga} />)}
				</Container>
			</main>

			<Footer />
		</>
	);
}

/**
 * @param {Object} props
 * @param {string} props.icon
 * @param {string} props.title
 * @param {string} props.description
 * @param {number} props.amountSlots
 * @param {number} props.status
 * @param {boolean} props.public
 */
function Vaga({ icon, title, description, amountSlots }) {
	return (
		<Card style={{ width: "22rem", height: "18rem", borderRadius: "1rem", marginTop: "4rem" }}>
			<Card.Body>
				<Card.Img
					src={icon}
					height="110px"
					width="110px"
					className="rounded-circle position-absolute"
					style={{ width: "110px", top: "-3.4rem", left: "7.5rem" }}
				/>

				<Card.Title className="title my-3" style={{ fontSize: "2rem", paddingTop: "2rem" }}>
					{title}
				</Card.Title>

				<Card.Subtitle className="Subtitle  ">Aberta - {amountSlots} vagas</Card.Subtitle>

				<Card.Text className="d-flex pt-2" style={{ fontSize: "1.1rem", height: "3rem" }}>
					{description}
				</Card.Text>

				<Card.Footer className="d-flex align-items-center bg-white">
					<Button className="mx-auto mt-2">Candidatar</Button>
				</Card.Footer>
			</Card.Body>
		</Card>
	);
}
