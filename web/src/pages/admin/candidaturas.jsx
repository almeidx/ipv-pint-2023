import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { BiNotepad } from "react-icons/bi";
import { BsCalendarDate } from "react-icons/bs";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { CreateReuniaoModal } from "../../components/CreateReuniaoModal.jsx";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";

export default function Candidaturas() {
	const [search, setSearch] = useState("");
	const [showCreateReuniaoModal, setShowCreateReuniaoModal] = useState(false);
	const [idCandidatura, setIdCandidatura] = useState(null);
	const { isLoading, data, mutate } = useSWR(`${API_URL}/candidaturas?admin`, fetcher);
	const { data: utilizadores } = useSWR(`${API_URL}/utilizadores`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, toggleToast } = useToast();

	// TODO: Botão para concluir vaga

	const filtered = useMemo(
		() =>
			(data ?? []).filter(
				({ vaga, utilizador }) =>
					vaga.title.toLowerCase().includes(search.toLowerCase()) ||
					utilizador.name.toLowerCase().includes(search.toLowerCase()),
			),
		[data, search],
	);

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

			<SearchBar placeholder="Pesquise por candidaturas..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, submissionDate, refEmail, utilizador, vaga }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`candidatura-${id}`}>
							<div>
								<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
									{id} - {utilizador.name}
								</span>

								<p className="mb-0">
									{formatDate(new Date(submissionDate))} - {vaga.title}
								</p>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
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
