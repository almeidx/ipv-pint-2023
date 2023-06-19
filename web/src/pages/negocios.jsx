import "../styles/negocios.css";

import { BsTrash } from "@react-icons/all-files/bs/BsTrash";
import { RiPencilLine } from "@react-icons/all-files/ri/RiPencilLine";
import { RxPlusCircled } from "@react-icons/all-files/rx/RxPlusCircled";
import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
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
import { resolveNameOfNextEstado } from "../utils/negocios.js";
import { Formik } from "formik";
import { object, string } from "yup";
import { formikButtonDisabled } from "../utils/formikButtonDisabled.js";

const createClientSchema = object().shape({
	name: string().required("O nome é obrigatório").max(100, "Máximo de 100 caracteres"),
});

const createContactoSchema = object().shape({
	value: string()
		.required("O contacto é obrigatório")
		.max(100, "Máximo de 100 caracteres")
		.when("type", {
			is: "0",
			then: () => string().email("O contacto tem de ser um email"),
		})
		.when("type", {
			is: "1",
			then: () =>
				string().matches(/^(\+351 ?)?(9[1236]\d) ?(\d{3}) ?(\d{3})$/, "O contacto tem de ser um número de telefone"),
		}),
	type: string().required("O tipo de contacto é obrigatório").oneOf(["0", "1"], "O tipo de contacto é inválido"),
});

export default function Negocios() {
	const [search, setSearch] = useState("");
	const [showCreateOrEditModal, setShowCreateOrEditModal] = useState(false);
	const [showCreateClientModal, setShowCreateClientModal] = useState(false);
	const [showCreateContactoModal, setShowCreateContactoModal] = useState(false);
	const [newClientId, setNewClientId] = useState(null);
	const [newContactoId, setNewContactoId] = useState(null);
	const [currentClientId, setCurrentClientId] = useState(null);
	const [editNegocioData, setEditNegocioData] = useState(null);
	const [isCreateModal, setIsCreateModal] = useState(false);
	const { isLoading, data, mutate: mutateNegocios } = useSWR(`${API_URL}/negocios`, fetcher);
	const { data: areasNegocio } = useSWR(`${API_URL}/areas-de-negocio`, fetcher);
	const { data: clientes, mutate: mutateClients } = useSWR(`${API_URL}/clientes`, fetcher);
	const { data: tiposProjeto } = useSWR(`${API_URL}/tipos-projeto`, fetcher);
	const { showToastWithMessage, showToast, toastMessage, toggleToast } = useToast();
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
		return <ErrorBase title="Por favor, inicie a sessão para ver as suas oportunidades" showLogin page="/negocios" />;
	}

	/** @param {object} data */
	async function handleCreate(data) {
		try {
			const response = await fetch(`${API_URL}/negocios`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Erro ao criar oportunidade", { cause: response });
			}

			mutateNegocios();

			showToastWithMessage("Oportunidade criado com sucesso!");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Erro ao criar oportunidade", "error");
		}
	}

	/** @param {object} data */
	async function handleEdit(data) {
		try {
			const response = await fetch(`${API_URL}/negocios/${editNegocioData.id}`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Erro ao editar oportunidade", { cause: response });
			}

			mutateNegocios();

			showToastWithMessage("Oportunidade editada com sucesso!");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Erro ao editar oportunidade", "error");
		}
	}

	/** @param {object} data */
	async function handleCreateClient(data) {
		try {
			const response = await fetch(`${API_URL}/clientes`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Erro ao criar cliente", { cause: response });
			}

			const { id } = await response.json();

			setNewClientId(id);
			setCurrentClientId(id);
			mutateClients();

			showToastWithMessage("Cliente criado com sucesso!");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Erro ao criar cliente", "error");
		}
	}

	/**
	 * @param {number} clientId
	 * @param {import("yup").InferType<typeof createContactoSchema>} data
	 */
	async function handleCreateContacto(clientId, data) {
		try {
			const response = await fetch(`${API_URL}/clientes/${clientId}/contactos`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Erro ao criar contacto", { cause: response });
			}

			const { id } = await response.json();

			setNewContactoId(id);

			showToastWithMessage("Contacto criado com sucesso!");
		} catch (error) {
			console.error(error);

			showToastWithMessage("Erro ao criar contacto", "error");
		}
	}

	return (
		<Page page="/negocios">
			<CreateOrEditNegocioModal
				show={showCreateOrEditModal}
				onHide={() => {
					setShowCreateOrEditModal(false);
					setNewClientId(null);
					setNewContactoId(null);
					setCurrentClientId(null);
					setEditNegocioData(null);
				}}
				onSave={(...args) => {
					if (isCreateModal) {
						handleCreate(...args);
					} else {
						handleEdit(...args);
					}
				}}
				areasNegocio={areasNegocio}
				clientes={clientes}
				tiposProjeto={tiposProjeto}
				newClientId={newClientId}
				openCreateClientModal={() => {
					setShowCreateClientModal(true);
					setShowCreateOrEditModal(false);
				}}
				openCreateContactModal={() => {
					setShowCreateContactoModal(true);
					setShowCreateOrEditModal(false);
				}}
				newContactoId={newContactoId}
				setCurrentClientId={setCurrentClientId}
				data={editNegocioData}
				isCreate={isCreateModal}
			/>

			<CreateClientModal
				show={showCreateClientModal}
				onHide={() => {
					setShowCreateClientModal(false);
					setShowCreateOrEditModal(true);
				}}
				onSave={handleCreateClient}
			/>

			<CreateContactoModal
				show={showCreateContactoModal}
				onHide={() => {
					setShowCreateContactoModal(false);
					setShowCreateOrEditModal(true);
				}}
				idCliente={currentClientId}
				onSave={handleCreateContacto}
			/>

			<Toast message={toastMessage} show={showToast} hide={() => toggleToast(false)} />

			<Container className="col-11 pt-5">
				<SearchBar placeholder="Pesquise por oportunidades..." onSearch={(text) => setSearch(text)} />
			</Container>

			<Container className="col-11 row mx-auto gap-5 pt-4">
				<Card
					className="btn btn-light negocio-card negocio-add"
					onClick={() => {
						setShowCreateOrEditModal(true);
						setEditNegocioData(null);
						setIsCreateModal(true);
					}}
					style={{ width: "25rem", height: "23rem", borderRadius: "1rem" }}
				>
					<Card.Body className="d-flex flex-column">
						<Card.Title className="title mb-5" style={{ fontSize: "1.6rem" }}>
							Adicionar Oportunidade
						</Card.Title>
						<RxPlusCircled className="negocio-card-icon mx-auto mb-auto mt-4" size={128} />
					</Card.Body>
				</Card>

				{isLoading ? (
					<Spinner />
				) : (
					(filtered ?? []).map((negocio) => (
						<Negocio
							key={negocio.id}
							onEditClick={(data) => {
								setEditNegocioData(data);
								setShowCreateOrEditModal(true);
								setIsCreateModal(false);
							}}
							{...negocio}
						/>
					))
				)}
			</Container>
		</Page>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {{ id: number; name: string }} props.areaNegocio
 * @param {{ id: number; name: string }} props.tipoProjeto
 * @param {{ idContacto: number; contacto: { type: 0 | 1; value: string } }[]} props.contactos
 * @param {{ id: number; name: string }?} props.centroTrabalho
 * @param {{ id: number; name: string }} props.cliente
 * @param {{ id: number; name: string }[]} props.necessidades
 * @param {{ estado: number; dataFinalizacao: string }[]} props.estados
 * @param {(data: any) => void} props.onEditClick
 */
function Negocio({ onEditClick, ...negocio }) {
	const { title, description, areaNegocio, contactos, centroTrabalho, cliente, necessidades, estados, tipoProjeto } =
		negocio;

	const estado = estados.at(-1);
	const estadoAtual = resolveNameOfNextEstado(estado);

	return (
		<Card className="negocio-card" style={{ width: "25rem", height: "23rem", borderRadius: "1rem" }}>
			<Card.Body>
				<Card.Title className="title d-flex justify-content-between" style={{ fontSize: "1.4rem" }}>
					{title}

					{estados.length === 0 ? (
						<OverlayTrigger placement="top" overlay={<Tooltip>Edite a sua Oportunidade</Tooltip>}>
							<Button className="border-0 bg-transparent p-0" onClick={() => onEditClick(negocio)}>
								<RiPencilLine size={24} color="black" />
							</Button>
						</OverlayTrigger>
					) : null}
				</Card.Title>

				<hr className="my-2" />

				<Card.Text style={{ marginBottom: "0.375rem" }}>{description}</Card.Text>

				<Card.Text style={{ marginBottom: "0.375rem" }}>
					<span className="fw-bold">{areaNegocio.name}: </span> {tipoProjeto.name}
				</Card.Text>

				<Card.Text style={{ marginBottom: "0.375rem" }}>
					<span className="fw-bold">Cliente: </span> {cliente.name}
				</Card.Text>

				<Card.Text style={{ marginBottom: "0.375rem" }}>
					<span className="fw-bold">Estado: </span> {estadoAtual.name}
				</Card.Text>

				{centroTrabalho ? (
					<Card.Text style={{ marginBottom: "0.375rem" }}>
						<span className="fw-bold">Centro de Trabalho: </span> {centroTrabalho.name}
					</Card.Text>
				) : null}

				{necessidades.length ? (
					<>
						<span className="fw-bold">Necessidades:</span>

						<ul style={{ marginBottom: "0.375rem" }}>
							{necessidades.map(({ id, name }) => (
								<li key={`necessidade-${negocio.id}-${id}`}>{name}</li>
							))}
						</ul>
					</>
				) : null}

				{contactos.length ? (
					<>
						<span className="fw-bold">Contactos:</span>

						<ul style={{ marginBottom: "0.375rem" }}>
							{contactos.map(({ idContacto, contacto }) => (
								<li key={idContacto}>
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
					</>
				) : null}
			</Card.Body>
		</Card>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {(negocio: Object) => void} props.onSave
 * @param {Object[]} props.areasNegocio
 * @param {number} props.areasNegocio.id
 * @param {string} props.areasNegocio.name
 * @param {Object[]} props.clientes
 * @param {number} props.clientes.id
 * @param {string} props.clientes.name
 * @param {Object[]} props.tiposProjeto
 * @param {number} props.tiposProjeto.id
 * @param {string} props.tiposProjeto.name
 * @param {() => void} props.openCreateClientModal
 * @param {number|null} props.newClientId
 * @param {() => void} props.openCreateContactModal
 * @param {number|null} props.newContactoId
 * @param {(id: number) => void} props.setCurrentClientId
 * @param {object|null} props.data
 * @param {boolean} props.isCreate
 */
function CreateOrEditNegocioModal({
	show,
	onHide,
	onSave,
	areasNegocio,
	clientes,
	tiposProjeto,
	openCreateClientModal,
	newClientId,
	openCreateContactModal,
	newContactoId,
	setCurrentClientId,
	data,
	isCreate,
}) {
	const [negocioData, setNegocioData] = useState({});
	const [contactos, setContactos] = useState([]);
	const [novaNecessidade, setNovaNecessidade] = useState("");

	useEffect(() => {
		if (newClientId !== null) {
			setNegocioData((state) => ({ ...state, idCliente: newClientId }));
		}
	}, [newClientId]);

	useEffect(() => {
		if (newContactoId !== null) {
			setNegocioData((state) => ({ ...state, contactos: [...(state.contactos ?? []), newContactoId] }));
		}
	}, [newContactoId]);

	useEffect(() => {
		if (negocioData.idCliente == null) {
			return;
		}

		fetch(`${API_URL}/clientes/${negocioData.idCliente}/contactos`, {
			credentials: "include",
		}).then(async (res) => {
			if (res.ok) {
				setContactos(await res.json());
			} else {
				throw new Error("Erro ao obter contactos", { cause: res });
			}
		});
	}, [negocioData.idCliente]);

	const contactoOptions = useMemo(() => contactos.map(({ id, value }) => ({ value: id, label: value })), [contactos]);

	function onHideWrapper() {
		onHide();
		setNegocioData({});
	}

	/** @param {number[]} ids */
	function handleContactosChange(ids) {
		setNegocioData((state) => ({ ...state, contactos: ids }));
	}

	function handleNewNecessidade() {
		const necessidade = novaNecessidade.trim();

		setNegocioData((state) => ({ ...state, necessidades: [...(state.necessidades ?? []), necessidade] }));

		setNovaNecessidade("");
	}

	function handleRemoveNecessidade(index) {
		setNegocioData((state) => ({
			...state,
			necessidades: state.necessidades.filter((_, i) => i !== index),
		}));
	}

	// TODO: Contactos criados não estão a aparecer na lista (qnd é só 1?)
	// TODO: add tipo projeto

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-negocio-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-negocio-modal">{isCreate ? "Criar Oportunidade" : "Editar Oportunidade"}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form className="mb-3">
					<Form.Group className="mb-3">
						<Form.Label htmlFor="negocio-titulo-edit">Titulo</Form.Label>
						<Form.Control
							id="negocio-titulo-edit"
							value={negocioData.title ?? data?.title ?? ""}
							onChange={(e) => setNegocioData((state) => ({ ...state, title: e.target.value }))}
							maxLength={100}
							placeholder="Titulo da oportunidade"
							required={isCreate}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label htmlFor="negocio-descricao-edit">Descrição</Form.Label>
						<Form.Control
							id="negocio-descricao-edit"
							value={negocioData.description ?? data?.description ?? ""}
							onChange={(e) => setNegocioData((state) => ({ ...state, description: e.target.value }))}
							as="textarea"
							maxLength={1_000}
							placeholder="Descrição da oportunidade"
							required={isCreate}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label htmlFor="negocio-tipo-projeto-edit">Tipo de Projeto</Form.Label>
						<Form.Select
							id="negocio-tipo-projeto-edit"
							value={negocioData.idTipoProjeto ?? data?.tipoProjeto?.id ?? -1}
							onChange={(e) =>
								setNegocioData((state) => ({ ...state, idTipoProjeto: Number.parseInt(e.target.value, 10) }))
							}
							required={isCreate}
						>
							<option value={-1} disabled>
								Selecione o tipo de projeto
							</option>

							{(tiposProjeto ?? []).map(({ id, name }) => (
								<option key={id} value={id}>
									{name}
								</option>
							))}
						</Form.Select>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label htmlFor="negocio-area-negocio-edit">Área de Negócio</Form.Label>
						<Form.Select
							id="negocio-area-negocio-edit"
							value={negocioData.idAreaNegocio ?? data?.areaNegocio?.id ?? -1}
							onChange={(e) =>
								setNegocioData((state) => ({ ...state, idAreaNegocio: Number.parseInt(e.target.value, 10) }))
							}
							required={isCreate}
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

					<Form.Group className="mb-3">
						<Form.Label htmlFor="nova-necessidade">Necessidades</Form.Label>
						<div className="d-flex gap-2">
							<Form.Control
								id="nova-necessidade"
								value={novaNecessidade}
								onChange={(e) => setNovaNecessidade(e.target.value)}
								maxLength={100}
								placeholder="Nova necessidade do negócio"
								disabled={(negocioData.necessidades ?? data?.necessidades ?? []).length >= 5}
							/>

							<Button
								variant="light"
								className="px-2"
								style={{ height: "fit-content" }}
								onClick={handleNewNecessidade}
								disabled={
									novaNecessidade.trim().length === 0 ||
									(negocioData.necessidades ?? data?.necessidades ?? []).length >= 5 ||
									(negocioData.necessidades ?? data?.necessidades ?? []).includes(novaNecessidade)
								}
							>
								<RxPlusCircled size={24} color="black" />
							</Button>
						</div>
						<ul>
							{(negocioData.necessidades ?? data?.necessidades ?? []).map((necessidade, index) => (
								<Necessidade
									key={necessidade}
									necessidade={necessidade}
									index={index}
									onRemove={handleRemoveNecessidade}
								/>
							))}
						</ul>
					</Form.Group>

					{isCreate ? (
						<>
							<Form.Group className="w-100 mb-3">
								<Form.Label htmlFor="negocio-cliente-edit">Cliente</Form.Label>

								<div className="d-flex w-100 gap-2">
									<Form.Select
										id="negocio-cliente-edit"
										value={negocioData.idCliente ?? -1}
										onChange={(e) => {
											const id = Number.parseInt(e.target.value, 10);

											setCurrentClientId(id);
											setNegocioData((state) => ({ ...state, idCliente: id }));
										}}
										disabled={newClientId !== null}
										required
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
									>
										<RxPlusCircled size={24} color="black" />
									</Button>
								</div>
							</Form.Group>
						</>
					) : null}
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
					Guardar
				</Button>

				<Button onClick={onHideWrapper} type="button">
					Cancelar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

/**
 * @param {Object} props
 * @param {string|{ id: number; name: string }} props.necessidade
 * @param {number} props.index
 * @param {(index: number) => void} props.onRemove
 */
function Necessidade({ necessidade, index, onRemove }) {
	return (
		<li className="mt-1">
			<div className="d-flex justify-content-between">
				<p className="mb-0">{typeof necessidade === "object" ? necessidade.name : necessidade}</p>

				<Button
					variant="light"
					className="d-flex justify-content-center align-items-center px-1 py-0"
					onClick={() => {
						onRemove(index);
					}}
				>
					<BsTrash size={16} color="black" />
				</Button>
			</div>
		</li>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {(data: any) => void} props.onSave
 */
function CreateClientModal({ show, onHide, onSave }) {
	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="manage-client-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-client-modal">Criar Cliente</Modal.Title>
			</Modal.Header>

			<Formik validationSchema={createClientSchema} initialValues={{ name: "" }} onSubmit={onSave}>
				{({ handleSubmit, handleBlur, handleChange, values, touched, errors }) => (
					<Form className="mb-3" noValidate onSubmit={handleSubmit}>
						<Modal.Body>
							<Form.Group className="mb-3">
								<Form.Label htmlFor="name">Nome</Form.Label>
								<Form.Control
									id="name"
									value={values.name}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.name && errors.name}
								/>
								<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
							</Form.Group>
						</Modal.Body>

						<Modal.Footer>
							<Button
								onClick={() => {
									handleSubmit();
									onHide();
								}}
								variant="success"
								disabled={formikButtonDisabled(errors, touched)}
							>
								Criar
							</Button>

							<Button onClick={onHide} type="button">
								Voltar
							</Button>
						</Modal.Footer>
					</Form>
				)}
			</Formik>
		</Modal>
	);
}

/**
 * @param {Object} props
 * @param {number} props.idCliente
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {(data: any) => void} props.onSave
 */
function CreateContactoModal({ idCliente, show, onHide, onSave }) {
	/** @param {import("yup").InferType<typeof createContactoSchema>} */
	function handleSubmit({ type, value }) {
		onSave(idCliente, { value, type: Number.parseInt(type, 10) });
		onHide();
	}

	return (
		<Modal show={show} onHide={onHide} size="lg" aria-labelledby="manage-contacto-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-contacto-modal">Criar Contacto de Cliente</Modal.Title>
			</Modal.Header>

			<Formik validationSchema={createContactoSchema} initialValues={{ value: "", type: "-1" }} onSubmit={handleSubmit}>
				{({ handleBlur, handleChange, handleSubmit, values, errors, touched }) => (
					<Form className="mb-3" noValidate onSubmit={handleSubmit}>
						<Modal.Body>
							<Form.Group className="mb-3">
								<Form.Label htmlFor="type">Tipo de contacto</Form.Label>
								<Form.Select
									id="type"
									value={values.type}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={touched.type && errors.type}
								>
									<option value="-1" disabled>
										Selecione o tipo de contacto
									</option>

									<option value="0">Email</option>
									<option value="1">Telefone</option>
								</Form.Select>
								<Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
							</Form.Group>

							{values.type === "-1" ? null : (
								<Form.Group className="mb-3">
									<Form.Label htmlFor="value">{values.type === "0" ? "Email" : "Telefone"}</Form.Label>
									<Form.Control
										id="value"
										placeholder={
											values.type === "0" ? "Introduza o email do cliente" : "Introduza o telefone do cliente"
										}
										type={values.value === "0" ? "email" : "tel"}
										value={values.value}
										onChange={handleChange}
										onBlur={handleBlur}
										isInvalid={touched.value && errors.value}
									/>
									<Form.Control.Feedback type="invalid">{errors.value}</Form.Control.Feedback>
								</Form.Group>
							)}
						</Modal.Body>

						<Modal.Footer>
							<Button
								onClick={handleSubmit}
								variant="success"
								type="submit"
								disabled={formikButtonDisabled(errors, touched)}
							>
								Criar
							</Button>

							<Button onClick={onHide} type="button">
								Voltar
							</Button>
						</Modal.Footer>
					</Form>
				)}
			</Formik>
		</Modal>
	);
}
