import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { BiNotepad } from "react-icons/bi";
import { BsCalendarDate } from "react-icons/bs";
import useSWR from "swr";
import { Multiselect } from "../../components/Multiselect.jsx";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";

export default function Candidaturas() {
	const [search, setSearch] = useState("");
	const [showCreateReuniaoModal, setShowCreateReuniaoModal] = useState(false);
	const [idCandidatura, setIdCandidatura] = useState(null);
	const { isLoading, data, mutate } = useSWR(`${API_URL}/candidaturas`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, toggleToast } = useToast();

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ vaga, utilizador }) =>
					vaga.title.toLowerCase().includes(search.toLowerCase()) ||
					utilizador.name.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	async function handleCreateReuniao(idCandidatura, data) {
		console.log(idCandidatura, data);

		try {
			const response = await fetch(`${API_URL}/reunioes`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, idCandidatura }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Reunião criada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar a reunião");
		}
	}

	return (
		<Container className="py-4">
			<h2 className="mb-3">Candidaturas</h2>

			<Toast hide={() => toggleToast(false)} showToast={showToast} toastMessage={toastMessage} />

			<CreateReuniaoModal
				show={showCreateReuniaoModal}
				onHide={() => setShowCreateReuniaoModal(false)}
				onSave={handleCreateReuniao}
				idCandidatura={idCandidatura}
			/>

			<SearchBar placeholder="Pesquise por candidaturas..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, submissionDate, refEmail, utilizador, vaga }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`candidatura-${id}`}>
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{id} - {utilizador.name}
								</span>

								<p className="mb-0">
									{formatDate(new Date(submissionDate))} - {vaga.title}
								</p>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<OverlayTrigger placement="top" overlay={<Tooltip>Notas da entrevista</Tooltip>}>
									<Button className="border-0 bg-transparent p-0">
										<BiNotepad size={40} color="black" />
									</Button>
								</OverlayTrigger>

								<OverlayTrigger placement="top" overlay={<Tooltip>Marcar reunião</Tooltip>}>
									<Button
										className="border-0 bg-transparent p-0"
										onClick={() => {
											setIdCandidatura(id);
											setShowCreateReuniaoModal(true);
										}}
									>
										<BsCalendarDate size={32} color="black" />
									</Button>
								</OverlayTrigger>
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Não foi encontrada nenhuma candidatura" : "Não há nenhuma candidatura registada"}</p>
				)}
			</ListGroup>
		</Container>
	);
}

function CreateReuniaoModal({ data, show, onHide, onSave, idCandidatura }) {
	const [reuniaoData, setReuniaoData] = useState({});

	function onHideWrapper() {
		onHide();
		setReuniaoData({});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-reuniao-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-reuniao-modal">Criar Reunião</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="title-edit">
						Titulo
					</FormLabel>
					<FormControl
						id="title-edit"
						placeholder="Título da reunião"
						value={reuniaoData.title}
						onChange={(e) => setReuniaoData((state) => ({ ...state, title: e.target.value }))}
						required
						max={100}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="description-edit">
						Descrição
					</FormLabel>
					<FormControl
						id="description-edit"
						placeholder="Descrição da reunião"
						value={reuniaoData.description}
						as="textarea"
						onChange={(e) => setReuniaoData((state) => ({ ...state, description: e.target.value }))}
						required
						max={1_000}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="subject-edit">
						Assunto
					</FormLabel>
					<FormControl
						id="subject-edit"
						placeholder="Assunto da reunião"
						value={reuniaoData.subject}
						onChange={(e) => setReuniaoData((state) => ({ ...state, subject: e.target.value }))}
						required
						max={100}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="startTime-edit">
						Data de início
					</FormLabel>
					<FormControl
						id="startTime-edit"
						placeholder="Data de início da reunião"
						value={reuniaoData.startTime}
						onChange={(e) => setReuniaoData((state) => ({ ...state, startTime: e.target.value }))}
						required
						type="datetime-local"
						style={{ maxWidth: "18rem" }}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="duration-edit">
						Duração (em minutos)
					</FormLabel>
					<FormControl
						id="duration-edit"
						placeholder="Duração da reunião (em minutos)"
						value={reuniaoData.duration}
						onChange={(e) => setReuniaoData((state) => ({ ...state, duration: e.target.value }))}
						required
						type="number"
						min={1}
						style={{ maxWidth: "18rem" }}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="participants-edit">
						Participantes
					</FormLabel>
					<Multiselect
						options={[
							{ name: "Arlindo Calça Fina", id: 1 },
							{ name: "Arlindo Calça Fina", id: 2 },
							{ name: "aosdkasokdkoasdasdokoasdkoasdoifoisadfoiuasdf", id: 3 },
						]}
					/>
				</FormGroup>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(idCandidatura, reuniaoData);
						onHide();
						setReuniaoData({});
					}}
					variant="success"
				>
					Guardar
				</Button>

				<Button onClick={onHideWrapper}>Cancelar</Button>
			</Modal.Footer>
		</Modal>
	);
}
