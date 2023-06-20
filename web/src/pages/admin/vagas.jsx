import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
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
import useSWR from "swr";
import { AdminPageError } from "../../components/AdminPageError.jsx";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { resolveIcon } from "../../utils/resolve-icon.js";

export default function Vagas() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [vagaData, setVagaData] = useState(null);
	const [isCreateModal, setIsCreateModal] = useState(false);
	const { showToast, showToastWithMessage, toastMessage, hide } = useToast();
	const { isLoading, data, mutate, error } = useSWR(`${API_URL}/vagas?admin`, fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ title, description }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	if (error) {
		return <AdminPageError error={error} />;
	}

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

			showToastWithMessage("Ocorreu um erro ao criar a vaga", "error");
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

			showToastWithMessage("Ocorreu um erro ao editar a vaga", "error");
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

			showToastWithMessage("Ocorreu um erro ao eliminar a vaga", "error");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={hide} show={showToast} message={toastMessage} />

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
								<img src={resolveIcon(icon)} height="64" width="64" className="me-1" />

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
 * @param {(message: string) => void} props.showToastWithMessage
 */
function CreateOrEditVagaModal({ show, onHide, data, onSave, isCreate, showToastWithMessage }) {
	const [vagaData, setVagaData] = useState({});
	const [previewUrl, setPreviewUrl] = useState(null);
	const [file, setFile] = useState(null);

	/** @param {import("react").ChangeEvent<HTMLInputElement>} */
	function handleIconChange(event) {
		const file = event.target.files[0];
		if (!file) return;

		setPreviewUrl(URL.createObjectURL(file));
		setFile(file);
	}

	function onHideWrapper() {
		onHide();
		setVagaData({});
		setPreviewUrl(null);
	}

	async function handleSave() {
		if (file) {
			try {
				const formData = new FormData();
				formData.append("file", file);

				const uploadResponse = await fetch(`${API_URL}/uploads`, {
					method: "POST",
					body: formData,
				});

				if (!uploadResponse.ok) {
					throw new Error("Something went wrong", { cause: uploadResponse });
				}

				const { fileName } = await uploadResponse.json();

				vagaData.icon = fileName;
			} catch (error) {
				console.error(error);

				showToastWithMessage("Ocorreu um erro ao fazer upload do ficheiro", "error");
			}
		}

		onSave(vagaData);
		onHideWrapper();
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-vaga-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-vaga-modal">{isCreate ? "Criar Vaga" : "Editar Vaga"}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form>
					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="title-edit">
							Titulo
						</Form.Label>
						<Form.Control
							id="title-edit"
							placeholder="Título da vaga"
							value={vagaData.title ?? data?.title ?? ""}
							onChange={(e) => setVagaData((state) => ({ ...state, title: e.target.value }))}
							required={isCreate}
							maxLength={100}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="description-edit">
							Descrição
						</Form.Label>
						<Form.Control
							id="description-edit"
							placeholder="Descrição da vaga"
							onChange={(e) => setVagaData((state) => ({ ...state, description: e.target.value }))}
							value={vagaData.description ?? data?.description ?? ""}
							required={isCreate}
							as="textarea"
							maxLength={1_000}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="amount-slots-edit">
							Quantidade de vagas
						</Form.Label>
						<Form.Control
							id="amount-slots-edit"
							placeholder="Quantidade de vagas"
							onChange={(e) => setVagaData((state) => ({ ...state, amountSlots: e.target.valueAsNumber }))}
							value={vagaData.amountSlots ?? data?.amountSlots ?? ""}
							required={isCreate}
							type="number"
							style={{ maxWidth: "18rem" }}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="public-edit">
							Pública
						</Form.Label>
						<Form.Check
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
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="status-edit">
							Estado
						</Form.Label>
						<Form.Select
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
						</Form.Select>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="icone-vaga-edit">
							Ícone
						</Form.Label>

						<div className="d-flex align-items-center gap-3">
							<Form.Control
								id="icone-vaga-edit"
								onChange={handleIconChange}
								required={isCreate}
								type="file"
								style={{ maxWidth: "18rem" }}
								accept="image/*"
							/>

							{previewUrl ?? vagaData.icon ?? data?.icon ? (
								<img
									className="ratio-1x1 object-cover"
									src={previewUrl ?? resolveIcon(vagaData.icon ?? data?.icon)}
									height={42}
								/>
							) : null}
						</div>
					</Form.Group>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={handleSave} variant="success">
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
