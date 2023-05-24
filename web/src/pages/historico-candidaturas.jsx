import Container from "react-bootstrap/Container";
import useSWR from "swr";
import { Page } from "../components/Page.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { formatDate } from "../utils/formatDate.js";
import { resolveIcon } from "../utils/resolve-icon.js";

export function HistoricoCandidaturas() {
	const { data, isLoading } = useSWR(`${API_URL}/candidaturas`, fetcher);

	return (
		<Page>
			<Container className="col-11 pt-5">
				<h1>Histórico Candidaturas</h1>

				<Container className="row mt-4 gap-3">
					{isLoading ? <Spinner /> : data.map(({ id, ...candidatura }) => <Candidatura key={id} {...candidatura} />)}
				</Container>
			</Container>
		</Page>
	);
}

/**
 * @param {Object} props
 * @param {string} props.submissionDate
 * @param {string?} props.refEmail
 * @param {string?} props.conclusionAt
 * @param {Object} props.vaga
 * @param {string} props.vaga.icon
 * @param {string} props.vaga.title
 */
function Candidatura({ submissionDate, refEmail, conclusionAt, vaga }) {
	return (
		<div className="d-flex align-items-center w-fit gap-2 rounded bg-white px-3 py-3" style={{ minWidth: "25rem" }}>
			<img src={resolveIcon(vaga.icon)} alt="" height={128} className="ratio-1x1 rounded-circle" />

			<div>
				<span className="fw-bold" style={{ fontSize: "1.1rem" }}>
					{vaga.title}
				</span>

				<p className="fw-semibold mb-0 mt-2">Submetida a</p>
				<span>{formatDate(new Date(submissionDate))}</span>

				{conclusionAt ? (
					<>
						<p className="fw-semibold mb-0 mt-2">Concluída a</p>
						<span>{formatDate(new Date(conclusionAt))}</span>
					</>
				) : null}

				{refEmail ? (
					<>
						<p className="fw-semibold mb-0 mt-2">Referido por</p>
						<span>{refEmail}</span>
					</>
				) : null}
			</div>
		</div>
	);
}
