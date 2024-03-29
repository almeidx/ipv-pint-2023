import { BsCalendarDate } from "@react-icons/all-files/bs/BsCalendarDate";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { RiPencilLine } from "@react-icons/all-files/ri/RiPencilLine";
import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ProgressBar from "react-bootstrap/ProgressBar";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { AdminPageError } from "../../components/AdminPageError.jsx";
import { CreateReuniaoModal } from "../../components/CreateReuniaoModal.jsx";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { estadosNames, resolveNameOfNextEstado } from "../../utils/negocios.js";

export default function Negocios() {
	const { user } = useUser();
	const [search, setSearch] = useState("");
	const [showEditModal, setShowEditModal] = useState(false);
	const [negocioData, setNegocioData] = useState(null);
	const [showCreateReuniaoModal, setShowCreateReuniaoModal] = useState(false);
	const [idNegocio, setIdNegocio] = useState(null);
	const [sortMethod, setSortMethod] = useState("titleAsc");
	const [negocioCreatorId, setNegocioCreatorId] = useState(null);
	const { isLoading, data, mutate, error } = useSWR(`${API_URL}/negocios?admin`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, hide } = useToast();
	const { data: utilizadores } = useSWR(`${API_URL}/utilizadores`, fetcher);

	const filtered = useMemo(
		() =>
			(data ?? [])
				.filter(
					({ title, description, criador, areaNegocio, cliente, tipoProjeto }) =>
						title.toLowerCase().includes(search.toLowerCase()) ||
						description.toLowerCase().includes(search.toLowerCase()) ||
						criador.name.toLowerCase().includes(search.toLowerCase()) ||
						areaNegocio.name.toLowerCase().includes(search.toLowerCase()) ||
						tipoProjeto.name.toLowerCase().includes(search.toLowerCase()) ||
						cliente.name.toLowerCase().includes(search.toLowerCase()),
				)
				.sort(sortWrapper(sortMethod)),
		[data, search, sortMethod],
	);

	const createReuniaoDefaultUserIds = useMemo(() => [negocioCreatorId, user.id], [negocioCreatorId, user.id]);

	if (error) {
		return <AdminPageError error={error} />;
	}

	async function handleEdit(data) {
		try {
			const response = await fetch(`${API_URL}/negocios/${negocioData.id}`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Negócio editado com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao editar o negócio", "error");
		}
	}

	async function handleCreateReuniao(data) {
		try {
			const response = await fetch(`${API_URL}/reunioes`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, idNegocio }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Reunião criada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar a reunião", "error");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={hide} show={showToast} message={toastMessage} />

			<div className="d-flex justify-content-between mb-2">
				<h2>Oportunidades</h2>

				<Link to="/negocios">
					<IoMdAdd size={40} color="black" />
				</Link>
			</div>

			<CreateReuniaoModal
				show={showCreateReuniaoModal}
				onHide={() => setShowCreateReuniaoModal(false)}
				onSave={handleCreateReuniao}
				utilizadores={utilizadores}
				title="Criar Reunião para Negócio"
				defaultUserIds={createReuniaoDefaultUserIds}
			/>

			<EditNegocioModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				onSave={handleEdit}
				data={negocioData}
				user={user}
			/>

			<div className="d-flex w-100 gap-3">
				<div className="w-100">
					<SearchBar placeholder="Pesquise por negócios..." onSearch={(value) => setSearch(value)} />
				</div>

				<div className="w-25">
					<FormSelect value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}>
						<option value="titleAsc">Titulo (ascendente)</option>
						<option value="titleDesc">Titulo (descendente)</option>
						<option value="dataCriacaoAsc">Data criação (ascendente)</option>
						<option value="dataCriacaoDesc">Data criação (descendente)</option>
						<option value="areaNegocio">Área de negócio</option>
						<option value="estado">Estado</option>
					</FormSelect>
				</div>
			</div>

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(
						({
							id,
							description,
							title,
							cliente,
							areaNegocio,
							centroTrabalho,
							criador,
							funcionarioResponsavel,
							contactos,
							createdAt,
							estados,
							necessidades,
							tipoProjeto,
						}) => (
							<ListGroup.Item className="d-flex align-items-center" key={id}>
								<div className="col-12">
									<div className="d-flex align-items-center mb-2">
										<span className="fw-bold" style={{ fontSize: "1.2rem" }}>
											{title}: &nbsp;
										</span>

										{description}
									</div>

									<Progresso estados={estados ?? []} />

									<div className="row align-self-center mt-2">
										<div className="col-sm">
											<p className="mb-0">
												<span className="fw-bold">Cliente:</span> {cliente.name}
											</p>

											<p className="mb-0">
												<span className="fw-bold">Area:</span> {areaNegocio.name}
											</p>

											<p className="mb-0">
												<span className="fw-bold">Tipo de Projeto:</span> {tipoProjeto.name}
											</p>

											<p className="mb-0">
												<span className="fw-bold">Criador:</span> {criador.name} ({criador.email})
											</p>

											<p className="mb-0">
												<span className="fw-bold">Responsável:</span>{" "}
												{funcionarioResponsavel
													? `${funcionarioResponsavel.name} (${funcionarioResponsavel.email})`
													: "Não associado"}
											</p>

											{necessidades.length ? (
												<>
													<span className="fw-bold">Necessidades</span>
													<ul className="mb-0">
														{necessidades.map(({ id: idNecessidade, name }) => (
															<li key={`${id}-necessidade-${idNecessidade}`}>{name}</li>
														))}
													</ul>
												</>
											) : (
												<p className="mb-0">
													<span className="fw-bold">Necessidades:</span> Não tem necessidades associadas
												</p>
											)}

											<span className="fw-bold">Contactos:</span>
											<ul className="mb-0">
												{contactos.map(({ idContacto, contacto }) => (
													<li key={`${id}-contacto-${idContacto}`}>
														<a
															className="text-black"
															href={`${contacto.type === 0 ? "mailto" : "tel"}:${contacto.value}`}
														>
															{contacto.value}
														</a>
													</li>
												))}
											</ul>
										</div>

										<div className="col-sm mb-0">
											<span className="fw-bold ms-5">Centro de Trabalho associado:</span>

											{centroTrabalho ? (
												<ul className="mb-0 ms-5">
													<li>{centroTrabalho.name}</li>
													<li>{centroTrabalho.location}</li>
													<li>{centroTrabalho.postalCode}</li>
													<li>{centroTrabalho.address}</li>
												</ul>
											) : (
												<p className="mb-0 ms-5">Não associado</p>
											)}
										</div>

										<div className="d-flex col-sm justify-content-end align-items-start gap-2 pt-2">
											<OverlayTrigger placement="top" overlay={<Tooltip>Marcar Reunião</Tooltip>}>
												<Button
													className="border-0 bg-transparent p-0 pe-2"
													onClick={() => {
														setIdNegocio(id);
														setNegocioCreatorId(criador.id);
														setShowCreateReuniaoModal(true);
													}}
												>
													<BsCalendarDate size={32} color="black" />
												</Button>
											</OverlayTrigger>

											<OverlayTrigger placement="top" overlay={<Tooltip>Editar Negócio</Tooltip>}>
												<Button
													className="border-0 bg-transparent p-0"
													onClick={() => {
														setNegocioData({ id, centroTrabalho, funcionarioResponsavel, estados });
														setShowEditModal(true);
													}}
												>
													<RiPencilLine size={32} color="black" />
												</Button>
											</OverlayTrigger>
										</div>
									</div>

									<p className="mb-0 mt-2" style={{ fontSize: "0.85rem" }}>
										ID: {id} • {formatDate(new Date(createdAt))}
									</p>
								</div>
							</ListGroup.Item>
						),
					)
				) : (
					<p>{search ? "Não foi encontrado nenhum negócio" : "Não há nenhum negócio registado"}</p>
				)}
			</ListGroup>
		</Container>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {Object} props.data
 * @param {() => void} props.onHide
 * @param {(data: Object) => void} props.onSave
 * @param {{ name: string; id: number }} props.user
 */
function EditNegocioModal({ data, show, onHide, onSave, user }) {
	const [negocioData, setNegocioData] = useState({});
	const { data: centrosDeTrabalho } = useSWR(`${API_URL}/centros-de-trabalho`, fetcher);

	function onHideWrapper() {
		onHide();
		setNegocioData({});
	}

	const estadoAtual = negocioData.estados?.at(-1) ?? data?.estados?.at(-1);
	const estado = resolveNameOfNextEstado(estadoAtual);

	function handleAdvanceEstado() {
		setNegocioData((state) => {
			const baseEstados = state.estados ??
				data?.estados ?? [
					{
						estado: 0,
						dataFinalizacao: new Date().toISOString(),
					},
				];

			return {
				...state,
				estados: [
					...baseEstados,
					{
						estado: !baseEstados.length || !estadoAtual ? 0 : (estadoAtual?.estado ?? 0) + 1,
						dataFinalizacao: new Date().toISOString(),
					},
				],
			};
		});
	}

	return (
		<Modal show={show} onHide={onHideWrapper} size="lg" aria-labelledby="manage-negocio-modal" centered>
			<Modal.Header closeButton>
				<Modal.Title id="manage-negocio-modal">Editar Negócio</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<FormGroup className="mb-3">
					<FormLabel htmlFor="centro-de-trabalho-edit">Centro de Trabalho</FormLabel>

					<FormSelect
						id="centro-de-trabalho-edit"
						value={negocioData.idCentroTrabalho ?? data?.centroTrabalho?.id ?? "-1"}
						onChange={(e) =>
							setNegocioData((state) => ({ ...state, idCentroTrabalho: Number.parseInt(e.target.value, 10) }))
						}
					>
						<option value="-1" disabled>
							Selecione o Centro de Trabalho
						</option>

						{(centrosDeTrabalho ?? []).map(({ id, name }) => (
							<option key={id} value={id}>
								{name}
							</option>
						))}
					</FormSelect>
				</FormGroup>

				<FormGroup className="d-flex flex-column">
					<FormLabel className="text-black" htmlFor="content-edit">
						Funcionário Responsável
						{negocioData.idFuncionarioResponsavel ?? data?.funcionarioResponsavel ? (
							<>
								:{" "}
								<span className="fw-bold">
									{negocioData.idFuncionarioResponsavel != null ? user.name : data.funcionarioResponsavel.name}
								</span>
							</>
						) : null}
					</FormLabel>

					{negocioData.idFuncionarioResponsavel ?? data?.funcionarioResponsavel ? null : (
						<Button
							className="mb-3 w-fit"
							onClick={() => {
								setNegocioData((state) => ({
									...state,
									idFuncionarioResponsavel: user.id,
								}));
							}}
						>
							Associar
						</Button>
					)}
				</FormGroup>

				<FormGroup className="d-flex flex-column">
					<FormLabel htmlFor="estado-edit">
						Estado atual: <span className="fw-bold">{estado.name}</span>
					</FormLabel>

					<Button
						className="w-fit"
						disabled={estadoAtual ? estadoAtual.estado === estadosNames.length - 1 : false}
						onClick={handleAdvanceEstado}
					>
						Avançar estado
					</Button>
				</FormGroup>
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

				<Button onClick={onHideWrapper}>Cancelar</Button>
			</Modal.Footer>
		</Modal>
	);
}

function Progresso({ estados }) {
	const obj = new Map(estados.map((estado) => [estado.estado, estado.dataFinalizacao]));
	const lastEstado = estados.at(-1);

	function hasState(estado) {
		if (!obj.size && estado === 0) return true;
		if (obj.has(estado)) return true;
		if (estado === (lastEstado ? lastEstado.estado + 1 : 0)) return true;

		return false;
	}

	return (
		<ProgressBar className="w-100" style={{ height: "1.3rem" }}>
			{estadosNames.map(({ color, name }, index) => (
				// <OverlayTrigger
				// 	key={`overlay-${index}`}
				// 	placement="top"
				// 	overlay={
				// 		<Tooltip id={`tooltip-${index}`}>
				// 			{obj.get(index) ? new Date(obj.get(index)).toLocaleDateString() : new Date().toLocaleDateString()}
				// 		</Tooltip>
				// 	}
				// >
				<ProgressBar
					className="text-black"
					style={{ backgroundColor: color }}
					now={hasState(index) ? 20 : 0}
					key={index}
					label={name}
					data-bs-toggle="tooltip"
					data-bs-placement="left"
				/>
				// </OverlayTrigger>
			))}
		</ProgressBar>
	);
}

/** @param {"dataCriacaoAsc"|"dataCriacaoDesc"|"areaNegocio"|"estado"|"titleAsc"|"titleDesc"} method */
function sortWrapper(method) {
	switch (method) {
		case "areaNegocio":
			return (a, b) => a.areaNegocio.name.localeCompare(b.areaNegocio.name);
		case "estado":
			return (a, b) => (a.estados.at(-1)?.estado ?? 0) - (b.estados.at(-1)?.estado ?? 0);
		case "titleAsc":
			return (a, b) => a.title.localeCompare(b.title);
		case "titleDesc":
			return (a, b) => b.title.localeCompare(a.title);
		case "dataCriacaoAsc":
			return (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
		case "dataCriacaoDesc":
			return (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
		default:
			return () => 0;
	}
}
