import { BiNoEntry } from "@react-icons/all-files/bi/BiNoEntry";
import { RiPencilLine } from "@react-icons/all-files/ri/RiPencilLine";
import { TbCheck } from "@react-icons/all-files/tb/TbCheck";
import { useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
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
import { BsFillFileEarmarkPersonFill } from "@react-icons/all-files/bs/BsFillFileEarmarkPersonFill.js";

export default function Utilizadores() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [userId, setUserId] = useState(null);
	const { isLoading, data, mutate, error } = useSWR(`${API_URL}/utilizadores`, fetcher);
	const { data: tiposUtilizador } = useSWR(`${API_URL}/tipos-utilizador`, fetcher);
	const { showToast, hide, toastMessage, showToastWithMessage } = useToast();

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ name, email }) =>
					name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	if (error) {
		return <AdminPageError error={error} />;
	}

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

			showToastWithMessage("Ocorreu um erro ao editar o utilizador", "error");
		}
	}

	/**
	 * @param {number} id
	 * @param {boolean} disabled
	 */
	async function handleDesativarUser(id, disabled) {
		try {
			const response = await fetch(`${API_URL}/utilizadores/${id}/disable`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ disabled }),
			});

			if (!response.ok) {
				throw new Error(`Ocorreu um erro ao ${disabled ? "desativar" : "ativar"} o utilizador`, { cause: response });
			}

			showToastWithMessage(`Utilizador ${disabled ? "desativado" : "ativado"} com sucesso`);

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage(`Ocorreu um erro ao ${disabled ? "desativar" : "ativar"} o utilizador`, "error");
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

			<Toast hide={hide} show={showToast} message={toastMessage} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, tipoUtilizador, name, email, lastLoginDate, disabled, createdAt, cv }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={id}>
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{name}
								</span>

								<p className="mb-0">
									<span className="fw-bold">Email</span>: {email}
								</p>

								<p className="mb-0">
									<span className="fw-bold">Tipo de utilizador</span>: {tipoUtilizador.name}
								</p>

								{lastLoginDate ? (
									<p className="mb-0">
										<span className="fw-bold">Último início de sessão</span>: {formatDate(new Date(lastLoginDate))}
									</p>
								) : null}

								<p className="mb-0" style={{ fontSize: "0.85rem" }}>
									ID: {id} • Conta criada em: {formatDate(new Date(createdAt))}
								</p>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
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

								<OverlayTrigger placement="top" overlay={<Tooltip>Ver CV</Tooltip>}>
									{cv ? (
										<a
											href={`${API_URL}/uploads/${cv}`}
											className="btn border-0 bg-transparent p-0"
											target="_blank"
											rel="external noopener noreferrer"
										>
											<BsFillFileEarmarkPersonFill size={32} color="black" />
										</a>
									) : (
										<Button disabled className="border-0 bg-transparent p-0">
											<BsFillFileEarmarkPersonFill size={32} color="black" />
										</Button>
									)}
								</OverlayTrigger>

								<OverlayTrigger
									placement="top"
									overlay={<Tooltip>{disabled ? "Ativar Utilizador" : "Desativar Utilizador"}</Tooltip>}
								>
									<Button onClick={() => handleDesativarUser(id, !disabled)} className="border-0 bg-transparent p-0">
										{disabled ? <TbCheck size={32} color="green" /> : <BiNoEntry size={32} color="red" />}
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
