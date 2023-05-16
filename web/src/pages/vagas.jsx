import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";
import useSWR from "swr";
import { Page } from "../components/Page.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";

export function Vagas() {
	const [search, setSearch] = useState("");
	const [vagasCheias, setVagasCheias] = useState(false);
	const { data, isLoading } = useSWR(`${API_URL}/vagas`, fetcher);

	const filteredVagas = search
		? (data ?? []).filter(
				(vaga) =>
					vaga.title.toLowerCase().includes(search.toLowerCase()) || vaga.description.includes(search.toLowerCase()),
		  )
		: data ?? [];

	return (
		<Page page="/vagas">
			<Container className="col-11 pt-5">
				<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />

				<FormCheck
					type="checkbox"
					label="Mostrar vagas cheias"
					checked={vagasCheias}
					onChange={() => setVagasCheias((state) => !state)}
					className="rounded-pill mt-4 w-fit bg-white py-2 pe-3 ps-5"
					id="vagasCheias"
				/>
			</Container>

			<Container className="col-12 row d-flex mx-auto gap-5 pt-4">
				{isLoading ? <Spinner /> : filteredVagas.map(({ id, ...vaga }) => <Vaga key={id} {...vaga} />)}
			</Container>
		</Page>
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

				<Card.Title className="title my-3 pt-5" style={{ fontSize: "2rem" }}>
					{title}
				</Card.Title>

				<Card.Subtitle>Aberta - {amountSlots} vagas</Card.Subtitle>

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
