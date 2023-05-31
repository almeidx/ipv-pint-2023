import { useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import { BiNoEntry } from "react-icons/bi";
import { RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function Utilizadores() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [userId, setUserId] = useState(null);
	const { isLoading, data, mutate } = useSWR(`${API_URL}/utilizadores`, fetcher);
	const { data: tiposUtilizador } = useSWR(`${API_URL}/tipos-utilizador`, fetcher);
	const { showToast, toggleToast, toastMessage, showToastWithMessage } = useToast();

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ name, email }) =>
					name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	/**
	 * @param {number} role
	 * @param {number} userId
	 */
	async function handleSave(role, userId) {
		setShowEditModal(false);
		setUserId(null);

		try {
			await fetcher(`${API_URL}/utilizadores/` + userId, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ idTipoUser: role }),
			});

			showToastWithMessage("Utilizador editado com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao editar o utilizador");
		}
	}

	return (
		<Container className="py-4">
			<h2 className="mb-3">Utilizadores</h2>

			<SearchBar placeholder="Pesquise por utilizadores..." onSearch={(value) => setSearch(value)} />

			<EditUtilizadorModal
				defaultValue={data?.find(({ id }) => id === userId)?.tipoUtilizador?.id}
				userId={userId}
				show={showEditModal}
				onSave={handleSave}
				onHide={() => setShowEditModal(false)}
				tiposUtilizadores={tiposUtilizador ?? []}
			/>

			<Toast hide={() => toggleToast(false)} show={showToast} message={toastMessage} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, tipoUtilizador, name, email, lastLoginDate }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{id} - {name}
								</span>

								<p className="mb-0" style={{ fontSize: "1rem" }}>
									{email}
								</p>

								<p className="mb-0" style={{ fontSize: "0.90rem" }}>
									Tipo de utilizador: <span className="fw-bold">{tipoUtilizador.name}</span>
								</p>

								{lastLoginDate ? (
									<p className="mb-0" style={{ fontSize: "0.85rem" }}>
										Ultimo login: {formatDate(new Date(lastLoginDate))}
									</p>
								) : null}
							</div>

							<div className="d-flex justify-content-center align-items-center gap-3">
								<OverlayTrigger placement="top" overlay={<Tooltip>Editar Utilizador</Tooltip>}>
									<Button
										onClick={() => {
											setUserId(id);
											setShowEditModal(true);
										}}
										className="border-0 bg-transparent p-0"
									>
										<RiPencilLine size={32} color="black" />
									</Button>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={<Tooltip>Apagar Utilizador</Tooltip>}>
									<Button onClick={() => {}} className="border-0 bg-transparent p-0">
										<BiNoEntry size={32} color="red" />
									</Button>
								</OverlayTrigger>
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Não foi encontrado nenhum utilizador" : "Não há nenhum utilizador registado"}</p>
				)}
			</ListGroup>
		</Container>
	);
}

function EditUtilizadorModal({ defaultValue, show, onHide, onSave, userId, tiposUtilizadores }) {
	const ref = useRef(null);

	// TODO: disable button if defaultValue === ref.current.value (it's not that simple)

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="edit-utilizador-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="edit-utilizador-modal">Editar Utilizador</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormLabel htmlFor="role-selector">Cargo do utilizador</FormLabel>

				<FormSelect id="role-selector" defaultValue={defaultValue} ref={ref}>
					{tiposUtilizadores.map(({ id, name }) => (
						<option key={id} value={id}>
							{name}
						</option>
					))}
				</FormSelect>
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={() => onSave(Number.parseInt(ref.current.value, 10), userId)} variant="success">
					Guardar
				</Button>
				<Button onClick={onHide}>Cancelar</Button>
			</Modal.Footer>
		</Modal>
	);
}
