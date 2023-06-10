import { BsTrash } from "@react-icons/all-files/bs/BsTrash";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { AdminPageError } from "../../components/AdminPageError.jsx";
import { Page } from "../../components/Page.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";

export default function NotasEntrevista() {
	const { id } = useParams();
	const { data, isLoading, mutate, error } = useSWR(`${API_URL}/reunioes/${id}/notas`, fetcher);
	const { showToast, showToastWithMessage, toastMessage, toggleToast } = useToast();

	if (error) {
		return <AdminPageError error={error} />;
	}

	/** @param {SubmitEvent} event */
	async function handleCreate(event) {
		event.preventDefault();

		const content = event.target.elements.content.value;

		try {
			const response = await fetch(`${API_URL}/reunioes/${id}/notas`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Nota criada com sucesso");

			event.target.reset();

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao criar a nota", "error");
		}
	}

	/** @param {number} idNota */
	async function handleDelete(idNota) {
		try {
			const response = await fetch(`${API_URL}/reunioes/${id}/notas/${idNota}`, {
				credentials: "include",
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			showToastWithMessage("Nota eliminada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao eliminar a nota", "error");
		}
	}

	return (
		<Page className="min-h-without-navbar bg-main py-5">
			<Toast hide={() => toggleToast(false)} show={showToast} message={toastMessage} />

			<Container className="mb-5">
				<h2 className="fw-bold mb-4">Entrevista</h2>

				<div className="d-flex justify-content-between align-items-center mb-4 rounded bg-white px-3 py-2 text-black">
					<div>
						<span className="fw-bold">Nome:</span> {isLoading ? <Spinner /> : data.candidatura.utilizador.name}
					</div>

					<div>
						<span className="fw-bold">Vaga:</span> {isLoading ? <Spinner /> : data.candidatura.vaga.title}
					</div>
				</div>

				<Form onSubmit={handleCreate}>
					<Form.Control
						className="mb-3"
						name="content"
						id="content"
						rows="8"
						as="textarea"
						placeholder="Escreva a sua nota"
					/>

					<Button variant="light" type="submit" className="rounded-pill px-5">
						Guardar
					</Button>
				</Form>
			</Container>

			<Container>
				<h2 className="fw-bold mb-4">Notas guardadas</h2>

				{isLoading ? (
					<Spinner />
				) : (
					data.notas.map(({ id, content, createdAt }) => (
						<div className="d-flex justify-content-between mb-3 rounded bg-white px-3 py-2" key={id}>
							<div className="d-flex justify-content-between flex-column">
								<p className="mb-0">{content}</p>

								<p className="text-muted mb-0 mt-2" style={{ fontSize: "0.9rem" }}>
									ID: {id} - Criada a {formatDate(new Date(createdAt), true)}
								</p>
							</div>

							<div className="pt-2">
								<OverlayTrigger placement="top" overlay={<Tooltip>Apagar Nota</Tooltip>}>
									<Button className="border-0 bg-transparent p-0" onClick={() => handleDelete(id)}>
										<BsTrash color="black" size={28} />
									</Button>
								</OverlayTrigger>
							</div>
						</div>
					))
				)}
			</Container>
		</Page>
	);
}
