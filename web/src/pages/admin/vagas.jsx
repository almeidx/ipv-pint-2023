import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function Vagas() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [vagaData, setVagaData] = useState(null);
	const [isCreateModal, setIsCreateModal] = useState(false);
	const { showToast, showToastWithMessage, toastMessage, toggleToast } = useToast();
	const { isLoading, data, mutate } = useSWR(`${API_URL}/vagas?admin`, fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ title, description }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	async function handleCreate(data) {
		try {
			const response = await fetch(`${API_URL}/vagas`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Vaga criada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar a vaga");
		}
	}

	async function handleEdit(data) {
		try {
			const response = await fetch(`${API_URL}/vagas/${vagaData.id}`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Vaga editada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao editar a vaga");
		}
	}

	async function handleDelete(id) {
		try {
			const response = await fetch(`${API_URL}/vagas/${id}`, {
				credentials: "include",
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Vaga eliminada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao eliminar a vaga");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={() => toggleToast(false)} showToast={showToast} toastMessage={toastMessage} />

			<div className="d-flex justify-content-between mb-2">
				<h2>Vagas</h2>

				<Button
					className="border-0 bg-transparent p-0"
					onClick={() => {
						setVagaData(null);
						setIsCreateModal(true);
						setShowEditModal(true);
					}}
				>
					<IoMdAdd size={40} color="black" />
				</Button>
			</div>

			<CreateOrEditVagaModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				data={vagaData}
				onSave={(data) => (isCreateModal ? handleCreate(data) : handleEdit(data))}
				isCreate={isCreateModal}
			/>

			<SearchBar placeholder="Pesquise por vagas..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, title, description, status, icon, public: public_, amountSlots }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`vaga-${id}`}>
							<div className="d-flex gap-2">
								<img src={icon} height="64" width="64" className="me-1" />

								<div>
									<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
										{id} - {title}
									</span>

									<p className="mb-0">{description || "Descrição"}</p>

									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										{statusToText(status)} - {public_ ? "Publica" : "Só para colaboradores"} - {amountSlots} vagas
									</p>
								</div>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<OverlayTrigger placement="top" overlay={<Tooltip>Editar Vaga</Tooltip>}>
									<Button
										className="border-0 bg-transparent p-0"
										onClick={() => {
											setVagaData({ id, title, description, status, icon, public: public_, amountSlots });
											setIsCreateModal(false);
											setShowEditModal(true);
										}}
									>
										<RiPencilLine size={32} color="black" />
									</Button>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={<Tooltip>Apagar Vaga</Tooltip>}>
									<Button className="border-0 bg-transparent p-0" onClick={() => handleDelete(id)}>
										<RiCloseFill size={40} color="red" />
									</Button>
								</OverlayTrigger>
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Não foi encontrada nenhuma vaga" : "Não há nenhuma vaga registada"}</p>
				)}
			</ListGroup>
		</Container>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {Object} props.data
 * @param {(data: any) => void} props.onSave
 * @param {boolean} [props.isCreate]
 */
function CreateOrEditVagaModal({ show, onHide, data, onSave, isCreate }) {
	const [vagaData, setVagaData] = useState({});

	function onHideWrapper() {
		onHide();
		setVagaData({});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-vaga-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-vaga-modal">{isCreate ? "Criar Vaga" : "Editar Vaga"}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="title-edit">
						Titulo
					</FormLabel>
					<FormControl
						id="title-edit"
						placeholder="Título da vaga"
						value={vagaData.title ?? data?.title}
						onChange={(e) => setVagaData((state) => ({ ...state, title: e.target.value }))}
						required={isCreate}
						maxLength={100}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="description-edit">
						Descrição
					</FormLabel>
					<FormControl
						id="description-edit"
						placeholder="Descrição da vaga"
						onChange={(e) => setVagaData((state) => ({ ...state, description: e.target.value }))}
						value={vagaData.description ?? data?.description}
						required={isCreate}
						as="textarea"
						maxLength={1_000}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="icone-vaga-edit">
						Ícone
					</FormLabel>
					<FormControl
						id="icone-vaga-edit"
						placeholder="Ícone da vaga"
						onChange={(e) => setVagaData((state) => ({ ...state, icon: e.target.value }))}
						value={vagaData.icon ?? data?.icon}
						required={isCreate}
						maxLength={100}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="amount-slots-edit">
						Quantidade de vagas
					</FormLabel>
					<FormControl
						id="amount-slots-edit"
						placeholder="Quantidade de vagas"
						onChange={(e) => setVagaData((state) => ({ ...state, amountSlots: e.target.value }))}
						value={vagaData.amountSlots ?? data?.amountSlots}
						required={isCreate}
						type="number"
						style={{ maxWidth: "18rem" }}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="public-edit">
						Pública
					</FormLabel>
					<FormCheck
						id="public-edit"
						placeholder="Pública"
						onChange={(e) =>
							setVagaData((state) => ({
								...state,
								public: state.public !== undefined ? !state.public : e.target.value,
							}))
						}
						checked={vagaData.public ?? data?.public}
						required={isCreate}
						type="switch"
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="status-edit">
						Estado
					</FormLabel>
					<FormSelect
						id="status-edit"
						placeholder="Estado da vaga"
						onChange={(e) => setVagaData((state) => ({ ...state, status: e.target.value }))}
						value={vagaData.status ?? data?.status ?? -1}
						required={isCreate}
						style={{ maxWidth: "18rem" }}
					>
						<option value="-1" disabled>
							Escolha o estado da vaga
						</option>
						<option value="0">Aberta</option>
						<option value="1">Fechada</option>
					</FormSelect>
				</FormGroup>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(vagaData);
						onHide();
						setVagaData({});
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

/** @param {number} status */
function statusToText(status) {
	switch (status) {
		case 0:
			return "Aberta";
		case 1:
			return "Fechada";
		default:
			return "Desconhecido";
	}
}
