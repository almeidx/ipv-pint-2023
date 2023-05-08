import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiLightbulbFill, RiTrophyFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

/** @type {import("chart.js").ChartOptions} */
const negociosChartOptions = {
	responsive: true,
	plugins: {
		legend: {
			display: false,
		},
		title: {
			display: true,
			text: "Número de negócios por mês",
			color: "white",
			font: {
				size: 20,
			},
		},
	},
	scales: {
		x: {
			axis: "x",
			ticks: {
				color: "white",
			},
		},
		y: {
			axis: "y",
			ticks: {
				color: "white",
			},
		},
	},
};

export function Home() {
	const { data } = useSWR(API_URL + "/reporting/negocios/chart", fetcher);

	const labels = useMemo(
		() =>
			data?.labels.map(
				/** @param {Date} date */ (date) =>
					new Date(date).toLocaleDateString("pt-PT", { month: "long", year: "numeric" }),
			) ?? [],
		[data],
	);

	const chartData = useMemo(
		/** @return {import("chart.js").ChartData} */ () => ({
			labels,
			datasets: [
				{
					label: "Nº de Negócios",
					data: data?.data ?? [],
					borderColor: "#2184c7",
				},
			],
		}),
		[data, labels],
	);

	return (
		<>
			<NavBar page="/" />

			<main className="min-h-without-navbar position-relative">
				<img
					src="/static/home-bg.jpeg"
					className="position-absolute w-100 h-100 inset-0 -z-10 m-0 object-cover p-0"
					fetchpriority="high"
				/>

				<Container className="col-12 row mx-auto gap-5 px-4 pt-5">
					<ReportingCard title="Utilizadores registados" endpoint="/utilizadores" />
					<ReportingCard title="Candidaturas submetidas" endpoint="/candidaturas" />
					<ReportingCard title="Negócios criados" endpoint="/negocios" />
				</Container>

				<Container className="col-12 row mx-auto gap-5 px-4 py-5">
					<ReportingCard title="Ideias submetidas" endpoint="/ideias" />
					<ReportingCard title="Total vagas" endpoint="/vagas" />
					<ReportingCard title="Número de beneficios" endpoint="/beneficios" />
				</Container>

				<div
					className="d-flex justify-content-center align-items-center flex-wrap gap-5 px-4 py-5"
					style={{ marginInline: "5rem" }}
				>
					<div className="col">
						<Line options={negociosChartOptions} data={chartData} />
					</div>
					<div className="col">
						<Line options={negociosChartOptions} data={chartData} />
					</div>
				</div>

				<Container className="col-12 row mx-auto gap-3">
					<h2 className="text-white">Funcionalidades principais do website:</h2>

					<PageCard
						title="Negócios"
						description="Negócios, Parcerias e os Investimentos que existem na empresa e de potenciais novas oportunidades"
						icon={FaHandHoldingUsd}
						href="/negocios"
					/>
					<PageCard
						title="Vagas"
						description="Vagas/Ofertas de trabalho em existem na empresa"
						icon={BsFillFileEarmarkPersonFill}
						href="/vagas"
					/>
					<PageCard
						title="Benefícios"
						description="Conheça todos os Benefícios que cada colaborador Softinsa pode usufruir"
						icon={RiTrophyFill}
						href="/beneficios"
					/>
					<PageCard
						title="Ideias"
						description="Faça recomendações de melhorias para a empresa e as suas equipas"
						icon={RiLightbulbFill}
						href="/ideias"
					/>
				</Container>
			</main>

			<Footer />
		</>
	);
}

const INTERVALS = [
	{ name: "Diário", value: 1 },
	{ name: "Semanal", value: 7 },
	{ name: "Mensal", value: 30 },
	{ name: "Total", value: "all" },
];

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.endpoint
 */
function ReportingCard({ title, endpoint }) {
	const [intervalIndex, setIntervalIndex] = useState(INTERVALS.length - 1);
	const intervalData = useMemo(() => INTERVALS[intervalIndex], [intervalIndex]);
	const { data, isLoading } = useSWR(API_URL + "/reporting" + endpoint + "?interval=" + intervalData.value, fetcher);

	function handleIntervalChange() {
		setIntervalIndex((idx) => (idx === INTERVALS.length - 1 ? 0 : idx + 1));
	}

	return (
		<div className="col rounded-3 bg-white px-4 py-3" style={{ width: "18rem" }}>
			<span className="d-flex justify-content-between">
				<p className="fw-bold mb-0">{title}</p>

				<Button variant="secondary" onClick={handleIntervalChange} disabled={isLoading} size="sm">
					{intervalData.name}
				</Button>
			</span>

			{isLoading ? <Spinner size="sm" /> : <p className="mb-0">{data}</p>}
		</div>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.href
 * @param {React.ComponentType} props.icon
 */
function PageCard({ title, description, icon: Icon, href }) {
	return (
		<Link to={href} className="text-reset text-decoration-none w-fit">
			<Card style={{ width: "18rem", height: "20rem", borderRadius: "1rem" }}>
				<Card.Body className="d-flex justify-content-center align-items-center flex-column">
					<Icon color="#3f51b5" size={90} />

					<Card.Title className="title my-3" style={{ fontSize: "2rem" }}>
						{title}
					</Card.Title>

					<Card.Text style={{ fontSize: "1.1rem" }}>{description}</Card.Text>
				</Card.Body>
			</Card>
		</Link>
	);
}
