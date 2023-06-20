import { BiNotepad } from "@react-icons/all-files/bi/BiNotepad";
import { RiCloseFill } from "@react-icons/all-files/ri/RiCloseFill";
import { RiPencilLine } from "@react-icons/all-files/ri/RiPencilLine";
import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { AdminPageError } from "../../components/AdminPageError.jsx";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";

export default function Reuniões() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [editData, setEditData] = useState({});
	const { isLoading, data, error, mutate } = useSWR(`${API_URL}/reunioes?admin`, fetcher);
	const { showToastWithMessage, toastType, toastMessage, hide, showToast } = useToast();

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ title, subject, description }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()) ||
					subject.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	if (error) {
		return <AdminPageError error={error} />;
	}

	async function handleEdit(data) {
		try {
			const response = await fetch(`${API_URL}/reunioes/${editData.id}`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Ocorreu um erro ao editar a reunião", { cause: response });
			}

			showToastWithMessage("Reunião editada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao editar a reunião", "error");
		}
	}

	/** @param {number} id */
	async function handleDelete(id) {
		try {
			const response = await fetch(`${API_URL}/reunioes/${id}`, {
				credentials: "include",
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Ocorreu um erro ao apagar a reunião", { cause: response });
			}

			showToastWithMessage("Reunião apagada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao apagar a reunião", "error");
		}
	}

	return (
		<Container className="py-4">
			<Toast show={showToast} hide={hide} type={toastType} message={toastMessage} />

			<EditReuniaoModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				onSave={handleEdit}
				data={editData}
			/>

			<div className="d-flex justify-content-between mb-2">
				<h2>Reuniões</h2>
			</div>

			<SearchBar placeholder="Pesquise por reuniões..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(
						({ id, startTime, duration, title, description, subject, negocio, candidatura, utilizadores }) => (
							<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
								<div>
									<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
										{id} - {title}: <span className="fw-normal">{subject}</span>
									</span>

									<p className="mb-0">
										{negocio ? (
											<>
												<span className="fw-bold">Oportunidade: </span>
												{negocio.title}
											</>
										) : null}
										{candidatura ? (
											<>
												<span className="fw-bold">Candidatura: </span>
												{candidatura.vaga.title}
											</>
										) : null}
									</p>

									<p className="mb-0">
										<span className="fw-bold">Participantes: </span>
										{utilizadores.map(({ name }) => name).join(", ")}
									</p>

									<p className="mb-2">{description}</p>

									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										{formatDate(new Date(startTime))} - {duration} minutos
									</p>
								</div>

								<div className="d-flex justify-content-center align-items-center gap-2">
									<OverlayTrigger placement="top" overlay={<Tooltip>Editar Reunião</Tooltip>}>
										<Button
											className="border-0 bg-transparent p-0"
											onClick={() => {
												setEditData({ id, title, description, subject, duration });
												setShowEditModal(true);
											}}
										>
											<RiPencilLine size={32} color="black" />
										</Button>
									</OverlayTrigger>

									<OverlayTrigger placement="top" overlay={<Tooltip>Notas da reunião</Tooltip>}>
										<Link to={`/admin/notas/${id}`}>
											<BiNotepad size={32} color="black" />
										</Link>
									</OverlayTrigger>

									<OverlayTrigger placement="top" overlay={<Tooltip>Apagar Reunião</Tooltip>}>
										<Button className="border-0 bg-transparent p-0" onClick={() => handleDelete(id)}>
											<RiCloseFill size={32} color="red" />
										</Button>
									</OverlayTrigger>
								</div>
							</ListGroup.Item>
						),
					)
				) : (
					<p>{search ? "Não foi encontrada nenhuma reunião" : "Não há nenhuma reunião registada"}</p>
				)}
			</ListGroup>
		</Container>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {(data: Object) => void} props.onSave
 * @param {Object} props.data
 */
function EditReuniaoModal({ show, onHide, onSave, user, data }) {
	const [reuniaoData, setReuniaoData] = useState({});

	function onHideWrapper() {
		onHide();
		setReuniaoData({});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-reuniao-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-reuniao-modal">Editar Reunião</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form>
					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="title-edit">
							Titulo
						</Form.Label>
						<Form.Control
							id="title-edit"
							placeholder="Título da reunião"
							value={reuniaoData.title ?? data?.title ?? ""}
							onChange={(e) => setReuniaoData((state) => ({ ...state, title: e.target.value }))}
							required
							max={100}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="description-edit">
							Descrição
						</Form.Label>
						<Form.Control
							id="description-edit"
							placeholder="Descrição da reunião"
							value={reuniaoData.description ?? data?.description ?? ""}
							as="textarea"
							onChange={(e) => setReuniaoData((state) => ({ ...state, description: e.target.value }))}
							required
							max={1000}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="subject-edit">
							Assunto
						</Form.Label>
						<Form.Control
							id="subject-edit"
							placeholder="Assunto da reunião"
							value={reuniaoData.subject ?? data?.subject ?? ""}
							onChange={(e) => setReuniaoData((state) => ({ ...state, subject: e.target.value }))}
							required
							max={100}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="duration-edit">
							Duração (em minutos)
						</Form.Label>
						<Form.Control
							id="duration-edit"
							placeholder="Duração da reunião (em minutos)"
							value={reuniaoData.duration ?? data?.duration ?? ""}
							onChange={(e) => setReuniaoData((state) => ({ ...state, duration: e.target.valueAsNumber }))}
							required
							type="number"
							min={1}
							style={{ maxWidth: "18rem" }}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(reuniaoData);
						onHideWrapper();
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
