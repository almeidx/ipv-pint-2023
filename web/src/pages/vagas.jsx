import { FaHistory } from "@react-icons/all-files/fa/FaHistory";
import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormSelect from "react-bootstrap/FormSelect";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { Page } from "../components/Page.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { resolveIcon } from "../utils/resolve-icon.js";

export default function Vagas() {
	const { user } = useUser();

	const [filtro, setFiltro] = useState("1");
	const [search, setSearch] = useState("");
	const [clickedVagaData, setClickedVagaData] = useState({});
	const [showCandidaturaModal, setShowCandidaturaModal] = useState(false);
	const { data, isLoading, mutate } = useSWR(`${API_URL}/vagas`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, toastType, hide } = useToast();

	const filteredVagas = useMemo(
		() =>
			(data ?? []).filter((vaga) => {
				if (filtro === "1" && vaga.amountSlots === vaga.slotsFilled) return false;
				if (!search) return true;

				return (
					vaga.title.toLowerCase().includes(search.toLowerCase()) || vaga.description.includes(search.toLowerCase())
				);
			}),
		[data, filtro, search],
	);

	/** @param {number} id */
	function onClickVaga(id) {
		setClickedVagaData(filteredVagas.find((vaga) => vaga.id === id));
		setShowCandidaturaModal(true);
	}

	/**
	 * @param {number} id
	 * @param {string?} refEmail
	 */
	async function handleCandidatarVaga(id, refEmail) {
		try {
			const response = await fetch(`${API_URL}/vagas/${id}/candidatar`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refEmail }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			setShowCandidaturaModal(false);

			showToastWithMessage("Candidatura enviada com sucesso!");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Não foi possível candidatar-se à vaga", "error");
		}
	}

	return (
		<Page page="/vagas">
			<Toast hide={hide} show={showToast} message={toastMessage} type={toastType} />

			<CandidatarVagaModal
				show={showCandidaturaModal}
				onHide={() => setShowCandidaturaModal(false)}
				data={clickedVagaData}
				userCv={user?.cv}
				onCandidatarVaga={handleCandidatarVaga}
			/>

			<Container className="col-11 pt-5">
				<div className="d-flex w-100 gap-3">
					<div className="w-100">
						<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />
					</div>

					<div className="w-25">
						<FormSelect value={filtro} onChange={(e) => setFiltro(e.target.value)}>
							<option value="1">Vagas não cheias</option>
							<option value="2">Todas</option>
						</FormSelect>
					</div>

					<div>
						<OverlayTrigger placement="bottom" overlay={<Tooltip>Visualizar histórico de candidaturas</Tooltip>}>
							<Link
								to="/vagas/historico"
								className="btn btn-light d-flex justify-content-center align-items-center p-2"
							>
								<FaHistory color="black" size={24} />
							</Link>
						</OverlayTrigger>
					</div>
				</div>
			</Container>

			<Container className="col-12 row d-flex mx-auto gap-5 pt-4">
				{isLoading ? (
					<Spinner />
				) : (data ?? []).length ? (
					filteredVagas.length ? (
						filteredVagas.map((vaga) => (
							<Vaga key={vaga.id} {...vaga} onClickVaga={onClickVaga} loggedIn={user !== null} />
						))
					) : (
						<p>Não foi encontrado nenhuma vaga</p>
					)
				) : (
					<p>Não há nenhuma vaga registada</p>
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
 * @param {number} props.slotsFilled
 * @param {(id: number) => void} props.onClickVaga
 * @param {boolean} props.loggedIn
 */
function Vaga({ id, icon, title, description, amountSlots, slotsFilled, onClickVaga, loggedIn, public: isPublic }) {
	return (
		<Card style={{ width: "22rem", height: "20rem", borderRadius: "1rem", marginTop: "4rem" }}>
			<Card.Body>
				<Card.Img
					src={resolveIcon(icon)}
					height="110px"
					width="110px"
					className="rounded-circle position-absolute"
					style={{ width: "110px", top: "-3.4rem", left: "7.5rem" }}
					fetchpriority="high"
				/>

				<div className="hide-scrollbar" style={{ height: "15rem", overflowY: "scroll" }}>
					<Card.Title className="title my-3 pt-5" style={{ fontSize: "1.8rem" }}>
						{title}
					</Card.Title>

					<Card.Subtitle>
						Aberta - {amountSlots - slotsFilled} vagas{isPublic ? "" : " - Só colaboradores"}
					</Card.Subtitle>

					<Card.Text className="d-flex pt-2" style={{ fontSize: "1.1rem", height: "4.8rem" }}>
						{description}
					</Card.Text>
				</div>

				<Card.Footer className="d-flex align-items-center bg-white">
					{loggedIn ? (
						<Button className="mx-auto mt-1" onClick={() => onClickVaga(id)}>
							Candidatar
						</Button>
					) : (
						<OverlayTrigger placement="top" overlay={<Tooltip>Faça login para se candidatar</Tooltip>}>
							<Link className="btn btn-primary mx-auto mt-2" to="/login">
								Candidatar
							</Link>
						</OverlayTrigger>
					)}
				</Card.Footer>
			</Card.Body>
		</Card>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {Object} props.data
 * @param {string?} props.userCv
 * @param {(id: number, refEmail: string | null) => void} props.onCandidatarVaga
 */
function CandidatarVagaModal({ show, onHide, data, userCv, onCandidatarVaga }) {
	const [refEmail, setRefEmail] = useState(null);

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

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Candidatar a Vaga</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<p className="mb-2">Vaga: {data?.title ?? "Desconhecida"}</p>

				<Form>
					{userCv ? (
						<a
							className="btn btn-primary mb-2"
							href={`${API_URL}/uploads/${userCv}`}
							target="_blank"
							rel="external noreferrer noopener"
						>
							Ver CV
						</a>
					) : (
						<Form.Group className="mb-3">
							<Form.Label htmlFor="cv">Curriculum Vitae</Form.Label>
							<Form.Control id="cv" type="file" accept="application/pdf" required onChange={handleCvSubmit} />
						</Form.Group>
					)}

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="title-edit">
							Email de Referência
						</Form.Label>
						<Form.Control
							id="title-edit"
							placeholder="Email de quem o recomendou"
							max={100}
							type="email"
							value={refEmail}
							onChange={(e) => setRefEmail(e.target.value)}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onCandidatarVaga(data.id, refEmail);
						onHide();
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
