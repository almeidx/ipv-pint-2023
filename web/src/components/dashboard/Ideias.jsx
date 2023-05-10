import { useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { IoMdAdd } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { API_URL } from "../../utils/constants.js";
import { fetcher } from "../../utils/fetcher.js";
import { formatDate } from "../../utils/formatDate.js";
import { SearchBar } from "../SearchBar.jsx";
import { Spinner } from "../Spinner.jsx";
import FormCheck from "react-bootstrap/FormCheck";

export default function Ideias() {
	const [search, setSearch] = useState("");
	const { isLoading, data, mutate } = useSWR(API_URL + "/ideias", fetcher);

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

			mutate();
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Container className="py-4">
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
				) : (
					data.map(({ id, dataCriacao, categoria, utilizador, content, ideiaValidada }) => (
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
									type="checkbox"
									label="Validada"
									value={ideiaValidada}
									onChange={(e) => handleValidateChange(id, e.target.checked)}
								/>

								<RiCloseFill size={32} color="red" />
							</div>
						</ListGroup.Item>
					))
				)}
			</ListGroup>
		</Container>
	);
}
