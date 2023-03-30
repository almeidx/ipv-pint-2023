import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { SearchBar } from "../components/SearchBar.jsx";

export function Vagas() {
	const [vagas, setVagas] = useState([
		{
			id: 1,
			title: "Jardineiro",
			vagas: 15,
			description: "Aparar as sebes do jardim",
			iconHref: "/static/vaga-jovem.png",
		},
		{
			id: 2,
			title: "Jardineiro",
			vagas: 15,
			description: "Aparar as sebes do jardim",
			iconHref: "/static/vaga-jovem.png",
		},
		{
			id: 3,
			title: "Jardineiro",
			vagas: 15,
			description: "Aparar as sebes do jardim",
			iconHref: "/static/vaga-jovem.png",
		},
		{
			id: 4,
			title: "Jardineiro",
			vagas: 15,
			description: "Aparar as sebes do jardim",
			iconHref: "/static/vaga-jovem.png",
		},
		{
			id: 5,
			title: "Jardineiro",
			vagas: 15,
			description: "Aparar as sebes do jardim",
			iconHref: "/static/vaga-jovem.png",
		},
		{
			id: 6,
			title: "Jardineiro",
			vagas: 15,
			description: "Aparar as sebes do jardim",
			iconHref: "/static/vaga-jovem.png",
		},
		{
			id: 7,
			title: "Jardineiro",
			vagas: 15,
			description: "Aparar as sebes do jardim",
			iconHref: "/static/vaga-jovem.png",
		},
		{
			id: 8,
			title: "Jardineiro",
			vagas: 15,
			description: "Aparar as sebes do jardim",
			iconHref: "/static/vaga-jovem.png",
		},
	]);
	const [search, setSearch] = useState("");
	const [vagasCheias, setVagasCheias] = useState(false);

	const filteredVagas = search
		? vagas.filter((vaga) => {
				const title = vaga.title.toLowerCase();
				const description = vaga.description.toLowerCase();

				return title.includes(search.toLowerCase()) || description.includes(search.toLowerCase());
		  })
		: vagas;

	return (
		<>
			<NavBar page="vagas" />

			<main className="min-h-without-navbar pb-5" style={{ backgroundColor: "#c5cae9" }}>
				<Container className="pt-5 col-11">
					<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />

					<FormCheck
						type="checkbox"
						label="Mostrar vagas cheias"
						checked={vagasCheias}
						onChange={() => setVagasCheias((state) => !state)}
						style={{ backgroundColor: "white", width: "fit-content" }}
						className="ps-5 pe-3 py-2 rounded-pill mt-4"
						id="vagasCheias"
					/>
				</Container>

				<Container className="col-11 pt-4 row mx-auto gap-5">
					{filteredVagas.map(({ id, ...vaga }) => (
						<Vaga key={id} {...vaga} />
					))}
				</Container>
			</main>

			<Footer />
		</>
	);
}

/**
 * @param {Object} props
 * @param {string} props.iconHref
 * @param {string} props.title
 * @param {string} props.description
 */
function Vaga({ iconHref, title, description, vagas }) {
	return (
		<Card style={{ width: "18rem", height: "15rem", borderRadius: "1rem", marginTop: "4rem" }}>
			<Card.Body>
				<Card.Img
					src={iconHref}
					height="110px"
					width="110px"
					className="rounded-circle"
					style={{ width: "110px", position: "absolute", top: "-3.4rem", left: "5.5rem" }}
				/>

				<Card.Title className="title my-3" style={{ fontSize: "2rem", paddingTop: "2rem" }}>
					{title}
				</Card.Title>

				<Card.Subtitle className="Subtitle  ">Aberta - {vagas} vagas</Card.Subtitle>

				<Card.Text style={{ fontSize: "1.1rem" }}>{description}</Card.Text>

				<Card.Footer className="d-flex align-items-center" style={{ backgroundColor: "white" }}>
					<Button className="mx-auto">Candidatar</Button>
				</Card.Footer>
			</Card.Body>
		</Card>
	);
}
