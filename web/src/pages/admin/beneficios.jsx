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
import { formatDate } from "../../utils/formatDate.js";
import { resolveIcon } from "../../utils/resolve-icon.js";

export default function Beneficios() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [beneficioData, setBeneficioData] = useState(null);
	const [isCreateModal, setIsCreateModal] = useState(false);
	const { isLoading, data, mutate, error } = useSWR(`${API_URL}/beneficios?admin`, fetcher);
	const { showToastWithMessage, showToast, toggleToast, toastMessage } = useToast();

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ content, shortContent, utilizador }) =>
					content.toLowerCase().includes(search.toLowerCase()) ||
					shortContent.toLowerCase().includes(search.toLowerCase()) ||
					utilizador.name.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	if (error) {
		return <AdminPageError error={error} />;
	}

	async function handleCreate(data) {
		try {
			const clone = { ...data };

			if ("dataValidade" in clone && clone.dataValidade) {
				clone.dataValidade = new Date(clone.dataValidade + ":00").toISOString();
			}

			const response = await fetch(`${API_URL}/beneficios`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(clone),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Benefício criado com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar o benefício", "error");
		}
	}

	async function handleEdit(data) {
		try {
			const response = await fetch(`${API_URL}/beneficios/${beneficioData.id}`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Benefício editado com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao editar o benefício", "error");
		}
	}

	/** @param {number} id */
	async function handleDelete(id) {
		try {
			const response = await fetch(`${API_URL}/beneficios/${id}`, {
				credentials: "include",
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Benefício eliminado com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao eliminar o benefício", "error");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={() => toggleToast(false)} show={showToast} message={toastMessage} />

			<div className="d-flex justify-content-between mb-2">
				<h2>Benefícios</h2>

				<Button
					className="border-0 bg-transparent p-0"
					onClick={() => {
						setBeneficioData(null);
						setIsCreateModal(true);
						setShowEditModal(true);
					}}
				>
					<IoMdAdd size={40} color="black" />
				</Button>
			</div>

			<CreateOrEditBeneficioModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				data={beneficioData}
				onSave={(data) => (isCreateModal ? handleCreate(data) : handleEdit(data))}
				isCreate={isCreateModal}
				showToastWithMessage={showToastWithMessage}
			/>

			<SearchBar placeholder="Pesquise por benefícios..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, dataValidade, content, shortContent, iconeBeneficio, utilizador }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div className="d-flex gap-2">
								<img src={resolveIcon(iconeBeneficio)} height="65" width="65" className="rounded-circle me-2" />

								<div>
									<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
										{id} - {shortContent}
									</span>

									<p className="mb-0">{content}</p>

									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										Valido até: {formatDate(new Date(dataValidade))} - Criado por: {utilizador.name} ({utilizador.id})
									</p>
								</div>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<OverlayTrigger placement="top" overlay={<Tooltip>Editar Beneficio</Tooltip>}>
									<Button
										className="border-0 bg-transparent p-0"
										onClick={() => {
											setBeneficioData({ id, dataValidade, content, shortContent, iconeBeneficio });
											setIsCreateModal(false);
											setShowEditModal(true);
										}}
									>
										<RiPencilLine size={32} color="black" />
									</Button>
								</OverlayTrigger>

								<OverlayTrigger placement="top" overlay={<Tooltip>Apagar Benefício</Tooltip>}>
									<Button className="border-0 bg-transparent p-0" onClick={() => handleDelete(id)}>
										<RiCloseFill size={32} color="red" />
									</Button>
								</OverlayTrigger>
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Não foi encontrado nenhum benefício" : "Não há nenhum benefício registado"}</p>
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
 * @param {(data: Object) => void} props.onSave
 * @param {boolean} [props.isCreate]
 * @param {(message: string) => void} props.showToastWithMessage
 */
function CreateOrEditBeneficioModal({ data, show, onHide, onSave, isCreate = false, showToastWithMessage }) {
	const [beneficioData, setBeneficioData] = useState({});
	const [previewUrl, setPreviewUrl] = useState(null);
	const [file, setFile] = useState(null);

	function onHideWrapper() {
		onHide();
		setBeneficioData({});
		setPreviewUrl(null);
	}

	/** @param {import("react").ChangeEvent<HTMLInputElement>} */
	function handleIconChange(event) {
		const file = event.target.files[0];
		if (!file) return;

		setPreviewUrl(URL.createObjectURL(file));
		setFile(file);
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

				beneficioData.iconeBeneficio = fileName;
			} catch (error) {
				console.error(error);

				showToastWithMessage("Ocorreu um erro ao fazer upload do ficheiro", "error");
			}
		}

		onSave(beneficioData);
		onHideWrapper();
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-beneficio-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-beneficio-modal">{isCreate ? "Criar Benefício" : "Editar Benefício"}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form>
					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="short-content-edit">
							Titulo
						</Form.Label>
						<Form.Control
							id="short-content-edit"
							placeholder="Título do benefício"
							value={beneficioData.shortContent ?? data?.shortContent ?? ""}
							onChange={(e) => setBeneficioData((state) => ({ ...state, shortContent: e.target.value }))}
							required={isCreate}
							max={100}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="content-edit">
							Descrição
						</Form.Label>
						<Form.Control
							id="content-edit"
							placeholder="Descrição do benefício"
							onChange={(e) => setBeneficioData((state) => ({ ...state, content: e.target.value }))}
							value={beneficioData.content ?? data?.content ?? ""}
							required={isCreate}
							as="textarea"
							maxLength={1_000}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="data-validade-edit">
							Data de validade
						</Form.Label>
						<Form.Control
							id="data-validade-edit"
							placeholder="Data de validade do benefício"
							onChange={(e) => setBeneficioData((state) => ({ ...state, dataValidade: e.target.value }))}
							value={resolveDateValue(beneficioData.dataValidade ?? data?.dataValidade)}
							type="datetime-local"
							required={isCreate}
							style={{ maxWidth: "18rem" }}
							min={new Date().toISOString()}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label className="text-black" htmlFor="icone-beneficio-edit">
							Ícone
						</Form.Label>

						<div className="d-flex align-items-center gap-3">
							<Form.Control
								id="icone-beneficio-edit"
								onChange={handleIconChange}
								required={isCreate}
								type="file"
								style={{ maxWidth: "18rem" }}
								accept="image/*"
							/>

							{previewUrl ?? beneficioData.iconeBeneficio ?? data?.iconeBeneficio ? (
								<img
									className="ratio-1x1 object-cover"
									src={previewUrl ?? resolveIcon(beneficioData.iconeBeneficio ?? data?.iconeBeneficio)}
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

/** @param {string} date */
function resolveDateValue(date) {
	if (!date) return "";

	return new Date(date).toISOString().split(".")[0].slice(0, -3);
}
