import "../styles/negocios.css";

import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { RiPencilLine } from "react-icons/ri";
import { RxPlusCircled } from "react-icons/rx";
import useSWR from "swr";
import { ErrorBase } from "../components/ErrorBase.jsx";
import { Multiselect } from "../components/Multiselect.jsx";
import { Page } from "../components/Page.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { Toast } from "../components/Toast.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useIsLoggedIn } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";

export function Negocios() {
	const [search, setSearch] = useState("");
	const { isLoading, data } = useSWR(`${API_URL}/negocios`, fetcher);
	const { data: areasNegocio } = useSWR(`${API_URL}/areas-de-negocio`, fetcher);
	const { data: clientes, mutate: mutateClients } = useSWR(`${API_URL}/clientes`, fetcher);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showCreateClientModal, setShowCreateClientModal] = useState(false);
	const [showCreateContactoModal, setShowCreateContactoModal] = useState(false);
	const { showToastWithMessage, showToast, toastMessage, toggleToast } = useToast();
	const [newClientId, setNewClientId] = useState(null);
	const [newContactoId, setNewContactoId] = useState(null);
	const [currentClientId, setCurrentClientId] = useState(null);
	const isLoggedIn = useIsLoggedIn();

	const filtered = search
		? (data ?? []).filter(
				({ title, description, areaNegocio, cliente }) =>
					title.toLowerCase().includes(search.toLowerCase()) ||
					description.toLowerCase().includes(search.toLowerCase()) ||
					areaNegocio.name.toLowerCase().includes(search.toLowerCase()) ||
					cliente.name.toLowerCase().includes(search.toLowerCase()),
		  )
		: data ?? [];

	if (!isLoggedIn) {
		return <ErrorBase title="Por favor, inicie a sessão para ver os seus negócios" showLogin page="/negocios" />;
	}

	async function handleCreate(data) {}

	async function handleCreateClient(data) {
		try {
			const response = await fetch(`${API_URL}/clientes`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Erro ao criar cliente");
			}

			const { id } = await response.json();

			setNewClientId(id);
			setCurrentClientId(id);
			mutateClients();

			showToastWithMessage("Cliente criado com sucesso!");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Erro ao criar cliente");
		}
	}

	async function handleCreateContacto(clientId, data) {
		try {
			const response = await fetch(`${API_URL}/clientes/${clientId}/contactos`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Erro ao criar contacto");
			}

			const { id } = await response.json();

			setNewContactoId(id);

			showToastWithMessage("Contacto criado com sucesso!");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Erro ao criar contacto");
		}
	}

	return (
		<Page page="/negocios">
			<CreateNegocioModal
				show={showCreateModal}
				onHide={() => {
					setShowCreateModal(false);
					setNewClientId(null);
				}}
				onSave={handleCreate}
				areasNegocio={areasNegocio}
				clientes={clientes}
				newClientId={newClientId}
				openCreateClientModal={() => {
					setShowCreateClientModal(true);
					setShowCreateModal(false);
				}}
				openCreateContactModal={() => {
					setShowCreateContactoModal(true);
					setShowCreateModal(false);
				}}
				newContactoId={newContactoId}
				setCurrentClientId={setCurrentClientId}
			/>

			<CreateClientModal
				show={showCreateClientModal}
				onHide={() => {
					setShowCreateClientModal(false);
					setShowCreateModal(true);
				}}
				onSave={handleCreateClient}
			/>

			<CreateContactoModal
				show={showCreateContactoModal}
				onHide={() => {
					setShowCreateContactoModal(false);
					setShowCreateModal(true);
				}}
				idCliente={currentClientId}
				onSave={handleCreateContacto}
			/>

			<Toast toastMessage={toastMessage} showToast={showToast} hide={() => toggleToast(false)} />

			<Container className="col-11 pt-5">
				<SearchBar placeholder="Pesquise por negócios..." onSearch={(text) => setSearch(text)} />
			</Container>

			<Container className="col-11 row mx-auto gap-5 pt-4">
				<Card
					className="btn btn-light negocio-card negocio-add"
					onClick={() => setShowCreateModal(true)}
					style={{ width: "25rem", height: "23rem", borderRadius: "1rem" }}
				>
					<Card.Body className="d-flex flex-column">
						<Card.Title className="title mx-auto my-3" style={{ fontSize: "2rem" }}>
							Adicionar Negócio
						</Card.Title>
						<RxPlusCircled className="negocio-card-icon m-auto" size="7rem" />
					</Card.Body>
				</Card>

				{isLoading ? <Spinner /> : (filtered ?? []).map((negocio) => <Negocio key={negocio.id} {...negocio} />)}
			</Container>
		</Page>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {Object} props.areaNegocio
 * @param {string} props.areaNegocio.name
 * @param {Object[]} props.contactos
 * @param {number} props.contactos.idContacto
 * @param {Object} props.contactos.contacto
 * @param {0|1} props.contactos.contacto.type
 * @param {string} props.contactos.contacto.value
 * @param {Object} props.centroTrabalho
 * @param {string} props.centroTrabalho.name
 * @param {Object} props.cliente
 * @param {string} props.cliente.name
 */
function Negocio({ title, description, areaNegocio, contactos, centroTrabalho, cliente }) {
	return (
		<Card className="negocio-card" style={{ width: "25rem", height: "23rem", borderRadius: "1rem" }}>
			<Card.Body>
				<Card.Title className="title d-flex justify-content-between my-3" style={{ fontSize: "2rem" }}>
					{title}
					<OverlayTrigger placement="top" overlay={<Tooltip>Edite o seu Negócio</Tooltip>}>
						<Button className="border-0 bg-transparent p-0">
							<RiPencilLine size={32} color="black" />
						</Button>
					</OverlayTrigger>
				</Card.Title>

				<hr />

				<Card.Text style={{ fontSize: "1.1rem" }}>
					<span className="fw-bold">{areaNegocio.name}</span> - {description}
				</Card.Text>

				<Card.Text style={{ fontSize: "1.1rem" }}>
					{" "}
					<span className="fw-bold"> Cliente -</span> {cliente.name}
				</Card.Text>

				<Card.Text style={{ fontSize: "1.1rem" }}>
					{" "}
					<span className="fw-bold"> Centro de Trabalho - </span> {centroTrabalho.name}
				</Card.Text>

				<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
					Contacto:
				</span>

				<ul>
					{contactos.map(({ idContacto, contacto }) => (
						<li key={idContacto} style={{ fontSize: "1.1rem" }}>
							<a
								className="text-black"
								style={{ listStyle: "none" }}
								href={`${contacto.type === 0 ? "mailto" : "tel"}:${contacto.value}`}
							>
								{contacto.value}
							</a>
						</li>
					))}
				</ul>
			</Card.Body>
		</Card>
	);
}

function CreateNegocioModal({
	show,
	onHide,
	onSave,
	areasNegocio,
	clientes,
	openCreateClientModal,
	newClientId,
	openCreateContactModal,
	newContactoId,
	setCurrentClientId,
}) {
	const [negocioData, setNegocioData] = useState({
		areaNegocio: -1,
		cliente: -1,
		contactos: [],
	});
	const [contactos, setContactos] = useState([]);

	useEffect(() => {
		if (newClientId !== null) {
			setNegocioData((state) => ({ ...state, cliente: newClientId }));
		}
	}, [newClientId]);

	useEffect(() => {
		if (newContactoId !== null) {
			setNegocioData((state) => ({ ...state, contactos: [...state.contactos, newContactoId] }));
		}
	}, [newContactoId]);

	useEffect(() => {
		fetch(`${API_URL}/clientes/${negocioData.cliente}/contactos`, {
			credentials: "include",
		}).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				setContactos(data);
			} else {
				throw new Error("Erro ao obter contactos");
			}
		});
	}, [negocioData.cliente]);

	const contactoOptions = useMemo(() => {
		const names = contactos.map(({ idContacto, contacto }) => ({
			value: idContacto,
			label: contacto.value,
		}));

		return names;
	}, []);

	function onHideWrapper() {
		onHide();
		setNegocioData({ areaNegocio: -1, cliente: -1, contactos: [] });
	}

	/** @param {number[]} ids */
	function handleContactosChange(ids) {
		setNegocioData((state) => ({ ...state, contactos: ids }));
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-negocio-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-negocio-modal">Criar Negócio</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form className="mb-3">
					<Form.Group className="mb-3">
						<Form.Label htmlFor="negocio-titulo-edit">Titulo</Form.Label>
						<Form.Control
							id="negocio-titulo-edit"
							value={negocioData.title}
							onChange={(e) => setNegocioData((state) => ({ ...state, title: e.target.value }))}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label htmlFor="negocio-descricao-edit">Descrição</Form.Label>
						<Form.Control
							id="negocio-descricao-edit"
							value={negocioData.description}
							onChange={(e) => setNegocioData((state) => ({ ...state, description: e.target.value }))}
							as="textarea"
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label htmlFor="negocio-area-negocio-edit">Área de Negócio</Form.Label>
						<Form.Select
							id="negocio-area-negocio-edit"
							value={negocioData.areaNegocio}
							onChange={(e) => setNegocioData((state) => ({ ...state, areaNegocio: e.target.value }))}
						>
							<option value={-1} disabled>
								Selecione uma área de negócio
							</option>

							{(areasNegocio ?? []).map(({ id, name }) => (
								<option key={id} value={id}>
									{name}
								</option>
							))}
						</Form.Select>
					</Form.Group>

					<Form.Group className="w-100 mb-3">
						<Form.Label htmlFor="negocio-cliente-edit">Cliente</Form.Label>

						<div className="d-flex w-100 gap-2">
							<Form.Select
								id="negocio-cliente-edit"
								value={negocioData.cliente}
								onChange={(e) => {
									setCurrentClientId(e.target.value);

									setNegocioData((state) => ({ ...state, cliente: e.target.value }));
								}}
								disabled={newClientId !== null}
							>
								<option value={-1} disabled>
									Selecione um cliente
								</option>

								{(clientes ?? []).map(({ id, name }) => (
									<option key={id} value={id}>
										{name}
									</option>
								))}
							</Form.Select>

							<Button
								variant="light"
								className="px-2"
								style={{ height: "fit-content" }}
								onClick={openCreateClientModal}
								disabled={newClientId !== null}
							>
								<RxPlusCircled size={24} color="black" />
							</Button>
						</div>
					</Form.Group>

					<Form.Group className="w-100 mb-3">
						<Form.Label htmlFor="negocio-contactos-edit">Contactos do cliente</Form.Label>

						<div className="d-flex w-100 gap-2">
							<Multiselect
								id="negocio-contactos-edit"
								options={contactoOptions}
								onSelectOption={handleContactosChange}
								buttonText="Selecionar os contactos do cliente"
								withSearch={false}
							/>

							<Button
								variant="light"
								className="px-2"
								style={{ height: "fit-content" }}
								onClick={openCreateContactModal}
								disabled={negocioData.cliente === -1}
							>
								<RxPlusCircled size={24} color="black" />
							</Button>
						</div>
					</Form.Group>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(negocioData);
						onHideWrapper();
					}}
					variant="success"
				>
					Criar
				</Button>

				<Button onClick={onHideWrapper}>Cancelar</Button>
			</Modal.Footer>
		</Modal>
	);
}

function CreateClientModal({ show, onHide, onSave }) {
	const [clientData, setClientData] = useState({});

	function onHideWrapper() {
		onHide();
		setClientData({});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-client-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-client-modal">Criar Cliente</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form className="mb-3">
					<Form.Group className="mb-3">
						<Form.Label htmlFor="client-name-edit">Nome</Form.Label>
						<Form.Control
							id="client-name-edit"
							value={clientData.name}
							onChange={(e) => setClientData((state) => ({ ...state, name: e.target.value }))}
							maxLength={100}
							required
						/>
					</Form.Group>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(clientData);
						onHideWrapper();
					}}
					variant="success"
				>
					Criar
				</Button>

				<Button onClick={onHideWrapper}>Voltar</Button>
			</Modal.Footer>
		</Modal>
	);
}

function CreateContactoModal({ idCliente, show, onHide, onSave }) {
	const [contactoData, setContactoData] = useState({
		type: -1,
	});

	function onHideWrapper() {
		onHide();
		setContactoData({
			type: -1,
		});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-contacto-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-contacto-modal">Criar Contacto de Cliente</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form className="mb-3">
					<Form.Group className="mb-3">
						<Form.Label htmlFor="contacto-type-edit">Tipo de contacto</Form.Label>
						<Form.Select
							id="contacto-type-edit"
							value={contactoData.type}
							onChange={(e) =>
								setContactoData((state) => ({ ...state, type: Number.parseInt(e.target.value, 10), value: "" }))
							}
							required
						>
							<option value={-1} disabled>
								Selecione o tipo de contacto
							</option>

							<option value={0}>Email</option>
							<option value={1}>Telefone</option>
						</Form.Select>
					</Form.Group>

					{contactoData.type === -1 ? null : (
						<Form.Group className="mb-3">
							<Form.Label htmlFor="contacto-value-edit">{contactoData.type === 0 ? "Email" : "Telefone"}</Form.Label>
							<Form.Control
								id="contacto-value-edit"
								value={contactoData.value}
								onChange={(e) => setContactoData((state) => ({ ...state, value: e.target.value }))}
								maxLength={100}
								required
								type={contactoData.type === 0 ? "email" : "tel"}
							/>
						</Form.Group>
					)}
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onSave(idCliente, contactoData);
						onHideWrapper();
					}}
					variant="success"
				>
					Criar
				</Button>

				<Button onClick={onHideWrapper}>Voltar</Button>
			</Modal.Footer>
		</Modal>
	);
}
