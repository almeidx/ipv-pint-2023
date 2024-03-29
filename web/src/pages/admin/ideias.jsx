import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { RiCloseFill } from "@react-icons/all-files/ri/RiCloseFill";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";
import ListGroup from "react-bootstrap/ListGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { AdminPageError } from "../../components/AdminPageError.jsx";
import { SearchBar } from "../../components/SearchBar.jsx";
import { Spinner } from "../../components/Spinner.jsx";
import { Toast } from "../../components/Toast.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";

export default function Ideias() {
	const [search, setSearch] = useState("");
	const { showToast, toastMessage, showToastWithMessage, hide } = useToast();
	const { isLoading, data, mutate, error } = useSWR(`${API_URL}/ideias`, fetcher);

	const filtered = search
		? (data ?? []).filter(
				({ id, content, categoria, utilizador }) =>
					id.toString().includes(search) ||
					content.toLowerCase().includes(search.toLowerCase()) ||
					categoria.toLowerCase().includes(search.toLowerCase()) ||
					utilizador.name.toLowerCase().includes(search.toLowerCase()),
		  )
		: data ?? [];

	if (error) {
		return <AdminPageError error={error} />;
	}

	/**
	 * @param {number} id
	 * @param {boolean} checked
	 */
	async function handleValidateChange(id, checked) {
		try {
			const response = await fetch(`${API_URL}/ideias/${id}`, {
				credentials: "include",
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ideiaValidada: checked,
				}),
			});

			if (!response.ok) {
				throw new Error("Something went wrong", {
					cause: response,
				});
			}

			showToastWithMessage((checked ? "Ideia validada" : "Ideia invalidada") + " com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao tentar alterar o estado da ideia", "error");
		}
	}

	/** @param {number} id */
	async function handleDelete(id) {
		try {
			const response = await fetch(`${API_URL}/ideias/${id}`, {
				credentials: "include",
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Something went wrong", {
					cause: response,
				});
			}

			showToastWithMessage("Ideia eliminada com sucesso");

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao tentar eliminar a ideia", "error");
		}
	}

	return (
		<Container className="py-4">
			<Toast hide={hide} show={showToast} message={toastMessage} />

			<div className="d-flex justify-content-between mb-2">
				<h2>Ideias</h2>

				<Link to="/ideias">
					<IoMdAdd size={40} color="black" />
				</Link>
			</div>

			<SearchBar placeholder="Pesquise por ideias..." onSearch={(value) => setSearch(value)} />

			<ListGroup>
				{isLoading ? (
					<Spinner />
				) : filtered.length ? (
					filtered.map(({ id, dataCriacao, categoria, utilizador, content, ideiaValidada }) => (
						<ListGroup.Item className="d-flex justify-content-between align-items-center" key={`ideia-${id}`}>
							<div>
								<span className="fw-bold text-wrap" style={{ fontSize: "1.1rem" }}>
									{id} - {content}
								</span>

								<p className="mb-0">
									{categoria} - {utilizador.name} - {formatDate(new Date(dataCriacao))}
								</p>
							</div>

							<div className="d-flex justify-content-center align-items-center gap-2">
								<FormCheck
									className="cursor-pointer"
									type="checkbox"
									id={`ideia-${id}-validada`}
									label="Validada"
									checked={ideiaValidada}
									onChange={(e) => handleValidateChange(id, e.target.checked)}
								/>
								<OverlayTrigger placement="top" overlay={<Tooltip>Apagar Ideia</Tooltip>}>
									<Button className="border-0 bg-transparent p-0" onClick={() => handleDelete(id)}>
										<RiCloseFill size={32} color="red" />
									</Button>
								</OverlayTrigger>
							</div>
						</ListGroup.Item>
					))
				) : (
					<p>{search ? "Não foi encontrada nenhuma ideia" : "Não há nenhuma ideia registada"}</p>
				)}
			</ListGroup>
		</Container>
	);
}
