import { BiNotepad } from "@react-icons/all-files/bi/BiNotepad";
import { BsCalendarDate } from "@react-icons/all-files/bs/BsCalendarDate";
import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormSelect from "react-bootstrap/FormSelect";
import ListGroup from "react-bootstrap/ListGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { AdminPageError } from "../../components/AdminPageError.jsx";
import { CreateReuniaoModal } from "../../components/CreateReuniaoModal.jsx";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { HandshakeIcon } from "../../components/icons/HandshakeIcon.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";

export default function Candidaturas() {
	const [search, setSearch] = useState("");
	const [filtro, setFiltro] = useState("1");
	const [showCreateReuniaoModal, setShowCreateReuniaoModal] = useState(false);
	const [idCandidatura, setIdCandidatura] = useState(null);
	const { isLoading, data, mutate, error } = useSWR(`${API_URL}/candidaturas?admin`, fetcher);
	const { data: utilizadores } = useSWR(`${API_URL}/utilizadores`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, toggleToast } = useToast();

	const filtered = useMemo(
		() =>
			(data ?? []).filter(({ conclusionAt, vaga, utilizador }) => {
				if (filtro === "2" && conclusionAt !== null) {
					return false;
				}

				return (
					vaga.title.toLowerCase().includes(search.toLowerCase()) ||
					utilizador.name.toLowerCase().includes(search.toLowerCase())
				);
			}),
		[data, search, filtro],
	);

	if (error) {
		return <AdminPageError error={error} />;
	}

	async function handleCreateReuniao(data) {
		try {
			const body = { ...data, idCandidatura };

			const response = await fetch(`${API_URL}/reunioes`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Reunião criada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar a reunião");
		}
	}

	/** @param {number} id */
	async function handleConclusao(id) {
		try {
			const response = await fetch(`${API_URL}/candidaturas/${id}/concluir`, {
				credentials: "include",
				method: "POST",
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Candidatura concluída com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao concluir a candidatura");
		}
	}

	return (
		<Container className="py-4">
			<h2 className="mb-3">Candidaturas</h2>

			<Toast hide={() => toggleToast(false)} show={showToast} message={toastMessage} />

			<CreateReuniaoModal
				show={showCreateReuniaoModal}
				onHide={() => setShowCreateReuniaoModal(false)}
				onSave={handleCreateReuniao}
				utilizadores={utilizadores}
				title="Criar Reunião para candidatura a Vaga"
			/>

			<div className="d-flex w-100 gap-3">
				<div className="w-100">
					<SearchBar placeholder="Pesquise por candidaturas..." onSearch={(value) => setSearch(value)} />
				</div>

				<div className="w-25">
					<FormSelect value={filtro} onChange={(e) => setFiltro(e.target.value)}>
						<option value="1">Todas</option>
						<option value="2">Não concluídas</option>
					</FormSelect>
				</div>
			</div>

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, submissionDate, refEmail, utilizador, vaga, conclusionAt }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`candidatura-${id}`}>
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{id} - {utilizador.name}
								</span>

								<p className="mb-0">
									{formatDate(new Date(submissionDate))} - {vaga.title}
								</p>

								{refEmail || conclusionAt ? (
									<p className="mb-0">
										{conclusionAt
											? `Concluída a: ${formatDate(new Date(conclusionAt), true)}${refEmail ? " | " : ""}`
											: ""}
										{refEmail ? `Referência: ${refEmail}` : ""}
									</p>
								) : null}
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<OverlayTrigger placement="top" overlay={<Tooltip>Concluir candidatura</Tooltip>}>
									<Button className="border-0 bg-transparent p-0" onClick={() => handleConclusao(id)}>
										<HandshakeIcon />
									</Button>
								</OverlayTrigger>

								<OverlayTrigger placement="top" overlay={<Tooltip>Notas da entrevista</Tooltip>}>
									<Link to={`/admin/notas/${id}`}>
										<BiNotepad size={40} color="black" />
									</Link>
								</OverlayTrigger>

								<OverlayTrigger placement="top" overlay={<Tooltip>Marcar reunião</Tooltip>}>
									<Button
										className="border-0 bg-transparent p-0"
										onClick={() => {
											setIdCandidatura(id);
											setShowCreateReuniaoModal(true);
										}}
									>
										<BsCalendarDate size={32} color="black" />
									</Button>
								</OverlayTrigger>
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Não foi encontrada nenhuma candidatura" : "Não há nenhuma candidatura registada"}</p>
				)}
			</ListGroup>
		</Container>
	);
}
