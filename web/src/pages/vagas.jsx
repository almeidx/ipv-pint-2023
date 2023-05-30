import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { Page } from "../components/Page.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";

export function Vagas() {
	const { user } = useUser();

	const [search, setSearch] = useState("");
	const [vagasCheias, setVagasCheias] = useState(false);
	const [clickedVagaData, setClickedVagaData] = useState({});
	const [showCandidaturaModal, setShowCandidaturaModal] = useState(false);
	const [hasCv, setHasCv] = useState(!!user?.cv);
	const { data, isLoading } = useSWR(`${API_URL}/vagas`, fetcher);

	// TODO: testar se funciona a submissão

	useEffect(() => {
		if (user) {
			setHasCv(!!user.cv);
		}
	}, [user]);

	const filteredVagas = search
		? (data ?? []).filter(
				(vaga) =>
					vaga.title.toLowerCase().includes(search.toLowerCase()) || vaga.description.includes(search.toLowerCase()),
		  )
		: data ?? [];

	/** @param {number} id */
	function onClickVaga(id) {
		setClickedVagaData(filteredVagas.find((vaga) => vaga.id === id));
		setShowCandidaturaModal(true);
	}

	return (
		<Page page="/vagas">
			<CandidatarVagaModal
				show={showCandidaturaModal}
				onHide={() => setShowCandidaturaModal(false)}
				data={clickedVagaData}
				hasCv={hasCv}
			/>

			<Container className="col-11 pt-5">
				<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />
				<div className="d-flex w-100 justify-content-between align-items-center">
					<FormCheck
						type="checkbox"
						label="Mostrar vagas cheias"
						checked={vagasCheias}
						onChange={() => setVagasCheias((state) => !state)}
						className="rounded-pill w-fit bg-white py-2 pe-3 ps-5"
						id="vagasCheias"
					/>

					<OverlayTrigger placement="bottom" overlay={<Tooltip>Visualizar histórico de candidaturas</Tooltip>}>
						<Link to="/vagas/historico" className="btn btn-light d-flex justify-content-center align-items-center p-2">
							<FaHistory color="black" size={24} />
						</Link>
					</OverlayTrigger>
				</div>
			</Container>

			<Container className="col-12 row d-flex mx-auto gap-5 pt-4">
				{isLoading ? (
					<Spinner />
				) : (
					filteredVagas.map((vaga) => <Vaga key={vaga.id} {...vaga} onClickVaga={onClickVaga} />)
				)}
			</Container>
		</Page>
	);
}

/**
 * @param {Object} props
 * @param {number} props.id
 * @param {string} props.icon
 * @param {string} props.title
 * @param {string} props.description
 * @param {number} props.amountSlots
 * @param {number} props.status
 * @param {boolean} props.public
 * @param {(id: number) => void} props.onClickVaga
 */
function Vaga({ id, icon, title, description, amountSlots, onClickVaga }) {
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
					<Button className="mx-auto mt-2" onClick={() => onClickVaga(id)}>
						Candidatar
					</Button>
				</Card.Footer>
			</Card.Body>
		</Card>
	);
}

function CandidatarVagaModal({ show, onHide, data, hasCv }) {
	/** @param {import("react").ChangeEvent<HTMLInputElement>} */
	async function handleCvSubmit(event) {
		const file = event.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${API_URL}/uploads`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			console.error(response);
			return;
		}

		const { fileName } = await response.json();

		await fetch(`${API_URL}/utilizadores/@me`, {
			credentials: "include",
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ cv: fileName }),
		});
	}

	// TODO: Opção para atualizar / visualizar cv atual?

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Candidatar a Vaga</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<p>Vaga: {data?.title ?? "Desconhecida"}</p>

				{!hasCv ? (
					<>
						<FormLabel htmlFor="cv">Curriculum Vitae</FormLabel>
						<FormControl id="cv" type="file" accept="application/pdf" required onChange={handleCvSubmit} />
					</>
				) : null}
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onHide();
						setVagaData({});
					}}
					variant="success"
				>
					Enviar
				</Button>

				<Button onClick={onHide} type="button">
					Cancelar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
