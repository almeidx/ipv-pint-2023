import { useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/Container";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import { BiNoEntry } from "react-icons/bi";
import { RiCheckFill, RiCloseFill, RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { SearchBar } from "../SearchBar.jsx";
import { Spinner } from "../Spinner.jsx";

export default function Reuniões() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [userId, setUserId] = useState(null);
	const [showToast, setShowToast] = useState(false);
	const [toastMessageType, setToastMessageType] = useState("");
	const { isLoading, data, mutate } = useSWR(API_URL + "/utilizadores", fetcher);
	const { data: tiposUtilizador } = useSWR(API_URL + "/tipos-utilizador", fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ name, email }) =>
					name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	function disableToast() {
		setShowToast(false);
	}

	/**
	 * @param {number} role
	 * @param {number} userId
	 */
	async function handleSave(role, userId) {
		setShowEditModal(false);
		setUserId(null);

		try {
			await fetch(API_URL + "/utilizadores/" + userId, {
				credentials: "include",
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					idTipoUser: role,
				}),
			});

			setToastMessageType("success");
			setShowToast(true);

			mutate();
		} catch (error) {
			console.error(error);

			setToastMessageType("error");
			setShowToast(true);
		}
	}

	return (
		<Container className="position-relative py-4">
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

			<Toast
				show={showToast}
				onClose={disableToast}
				className="position-absolute"
				style={{ bottom: "1rem", right: "1rem", zIndex: "9999" }}
			>
				<Toast.Body className="d-flex align-items-center justify-content-between gap-2">
					<p className="mb-0">
						{toastMessageType === "success" ? (
							<>
								<RiCheckFill size={24} color="green" /> Utilizador editado com sucesso
							</>
						) : (
							<>
								<RiCloseFill size={24} color="red" /> Falha ao editar utilizador
							</>
						)}
					</p>

					<CloseButton onClick={disableToast} />
				</Toast.Body>
			</Toast>

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : (
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

							<div className="d-flex justify-content-center align-items-center gap-2">
								<Button
									onClick={() => {
										setUserId(id);
										setShowEditModal(true);
									}}
									className="border-0 bg-transparent"
								>
									<RiPencilLine size={32} color="black" />
								</Button>

								<Button onClick={() => {}} className="border-0 bg-transparent">
									<BiNoEntry size={32} color="red" />
								</Button>
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}

function EditUtilizadorModal({ defaultValue, show, onHide, onSave, userId, tiposUtilizadores }) {
	const ref = useRef(null);

	// TODO: disable button if defaultValue === ref.current.value (it's not that simple)

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Editar Utilizador</Modal.Title>
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
