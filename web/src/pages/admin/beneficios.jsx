import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
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
import { formatDate } from "../../utils/formatDate.js";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function Beneficios() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [beneficioData, setBeneficioData] = useState(null);
	const [isCreateModal, setIsCreateModal] = useState(false);
	const { isLoading, data, mutate } = useSWR(`${API_URL}/beneficios?admin`, fetcher);
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

			showToastWithMessage("Ocorreu um erro ao criar o benefício");
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

			showToastWithMessage("Ocorreu um erro ao editar o benefício");
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

			showToastWithMessage("Ocorreu um erro ao eliminar o benefício");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={() => toggleToast(false)} showToast={showToast} toastMessage={toastMessage} />

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
			/>

			<SearchBar placeholder="Pesquise por benefícios..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, dataValidade, content, shortContent, iconeBeneficio, utilizador }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div className="d-flex gap-2">
								<img src={iconeBeneficio} height="65" width="65" className="me-2" />

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
								<OverlayTrigger placement="top" overlay={<Tooltip>Editar Beneficío</Tooltip>}>
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
 */
function CreateOrEditBeneficioModal({ data, show, onHide, onSave, isCreate = false }) {
	const [beneficioData, setBeneficioData] = useState({});

	function onHideWrapper() {
		onHide();
		setBeneficioData({});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-beneficio-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-beneficio-modal">{isCreate ? "Criar Benefício" : "Editar Benefício"}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="short-content-edit">
						Titulo
					</FormLabel>
					<FormControl
						id="short-content-edit"
						placeholder="Título do benefício"
						value={beneficioData.shortContent ?? data?.shortContent}
						onChange={(e) => setBeneficioData((state) => ({ ...state, shortContent: e.target.value }))}
						required={isCreate}
						max={100}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="content-edit">
						Descrição
					</FormLabel>
					<FormControl
						id="content-edit"
						placeholder="Descrição do benefício"
						onChange={(e) => setBeneficioData((state) => ({ ...state, content: e.target.value }))}
						value={beneficioData.content ?? data?.content}
						required={isCreate}
						as="textarea"
						maxLength={1_000}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="data-validade-edit">
						Data de validade
					</FormLabel>
					<FormControl
						id="data-validade-edit"
						placeholder="Data de validade do benefício"
						onChange={(e) => setBeneficioData((state) => ({ ...state, dataValidade: e.target.value }))}
						value={resolveDateValue(beneficioData.dataValidade ?? data?.dataValidade)}
						type="datetime-local"
						required={isCreate}
						style={{ maxWidth: "18rem" }}
						min={new Date().toISOString()}
					/>
				</FormGroup>

				<FormGroup className="mb-3">
					<FormLabel className="text-black" htmlFor="icone-beneficio-edit">
						Ícone
					</FormLabel>
					<FormControl
						id="icone-beneficio-edit"
						placeholder="Ícone do benefício"
						onChange={(e) => setBeneficioData((state) => ({ ...state, iconeBeneficio: e.target.value }))}
						value={beneficioData.iconeBeneficio ?? data?.iconeBeneficio}
						required={isCreate}
						maxLength={100}
					/>
				</FormGroup>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(beneficioData);
						onHide();
						setBeneficioData({});
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

/** @param {string} date */
function resolveDateValue(date) {
	if (!date) return "";

	return new Date(date).toISOString().split(".")[0].slice(0, -3);
}
