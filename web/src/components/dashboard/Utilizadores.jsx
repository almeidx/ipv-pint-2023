import { useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import { BiNoEntry } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import { RiPencilLine } from "react-icons/ri";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { SearchBar } from "../SearchBar.jsx";

export default function Reuniões() {
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [userId, setUserId] = useState(null);
	const { isLoading, data } = useSWR(API_URL + "/utilizadores", fetcher);
	const { data: tiposUtilizador } = useSWR(API_URL + "/tipos-utilizador", fetcher);

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ name, email }) =>
					name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

	return (
		<Container className="py-4">
			<h2 className="mb-3">Utilizadores</h2>

			<SearchBar placeholder="Pesquise por utilizadores..." onSearch={(value) => setSearch(value)} />

			<EditUtilizadorModal
				defaultValue={data?.find(({ id }) => id === userId)?.tipoUtilizador?.id}
				userId={userId}
				show={showEditModal}
				onSave={(role, userId) => {
					setShowEditModal(false);
					setUserId(null);

					console.log({
						role,
						userId,
					});
				}}
				onHide={() => setShowEditModal(false)}
				tiposUtilizadores={tiposUtilizador ?? []}
			/>

			<ListGroup>
				{isLoading ? (
					<FaSpinner />
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

							<div className="d-flex gap-2 justify-content-center align-items-center">
								<Button
									onClick={() => {
										setUserId(id);
										setShowEditModal(true);
									}}
									className="bg-transparent border-0"
								>
									<RiPencilLine size={32} color="black" />
								</Button>

								<BiNoEntry size={32} color="red" />
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
