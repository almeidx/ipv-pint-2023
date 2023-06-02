import { BsFillFileEarmarkPersonFill } from "@react-icons/all-files/bs/BsFillFileEarmarkPersonFill";
import { FaHandHoldingUsd } from "@react-icons/all-files/fa/FaHandHoldingUsd";
import { RiLightbulbFill } from "@react-icons/all-files/ri/RiLightbulbFill";
import { RiTrophyFill } from "@react-icons/all-files/ri/RiTrophyFill";
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Bar, Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { Page } from "../components/Page.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { estadosNames } from "../utils/negocios.js";
import { roundRect } from "../utils/roundRect.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip);

/** @type {import("chart.js").Plugin[]} */
const chartPlugins = [
	{
		id: "customCanvasBackgroundColor",
		beforeDraw: (chart, _args, options) => {
			const { ctx } = chart;
			ctx.save();

			ctx.globalCompositeOperation = "destination-over";
			ctx.fillStyle = options.color;

			roundRect(ctx, 0, 0, chart.width, chart.height, 10);

			ctx.restore();
		},
	},
];

const INTERVALS = [
	{ name: "Diário", value: 1 },
	{ name: "Semanal", value: 7 },
	{ name: "Mensal", value: 30 },
	{ name: "Total", value: "all" },
];

export default function Home() {
	return (
		<Page className="min-h-without-navbar position-relative" page="/">
			<img
				src="/static/home-bg.jpeg"
				className="position-absolute w-100 h-100 inset-0 -z-10 m-0 object-cover p-0"
				fetchpriority="high"
			/>

			<Container className="col-12 row mx-auto gap-5 px-4 pt-5">
				<ReportingCard title="Utilizadores registados" page="/utilizadores" />
				<ReportingCard title="Candidaturas submetidas" page="/candidaturas" />
				<ReportingCard title="Negócios criados" page="/negocios" />
			</Container>

			<Container className="col-12 row mx-auto gap-5 px-4 py-5">
				<ReportingCard title="Ideias submetidas" page="/ideias" />
				<ReportingCard title="Total vagas" page="/vagas" />
				<ReportingCard title="Número de beneficios" page="/beneficios" />
			</Container>

			<Container className="row mx-auto pb-5">
				<div className="col-6">
					<NegociosPorMesChart />
				</div>
				<div className="col-6">
					<VolumeNegociosPorEstadoChart />
				</div>
			</Container>

			<Container className="col-12 row mx-auto gap-3 pb-5">
				<h2 className="text-white">Funcionalidades principais do website:</h2>

				<PageCard
					title="Oportunidades"
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
		</Page>
	);
}

function NegociosPorMesChart() {
	const { data } = useSWR(`${API_URL}/reporting/negocios/mes`, fetcher);

	const negociosChartData = useMemo(
		/** @return {import("chart.js").ChartData} */ () => ({
			labels:
				data?.labels.map(
					/** @param {Date} date */ (date) =>
						new Date(date).toLocaleDateString("pt-PT", { month: "long", year: "numeric" }),
				) ?? [],
			datasets: [
				{
					label: "Nº de Negócios",
					data: data?.data ?? [],
					borderColor: "#2184c7",
				},
			],
		}),
		[data],
	);

	return <Line options={getChartOptions("Negócios criados por mês")} data={negociosChartData} plugins={chartPlugins} />;
}

function VolumeNegociosPorEstadoChart() {
	const { data } = useSWR(`${API_URL}/reporting/negocios/volume-estados`, fetcher);

	const negociosChartData = useMemo(
		/** @return {ChartData} */ () => ({
			labels:
				data?.labels.map(/** @param {number} estado */ (estado) => estadosNames[estado]?.name ?? "Desconhecido") ?? [],
			datasets: [
				{
					label: "Nº de Negócios",
					data: data?.data ?? [],
					backgroundColor: data?.data.map((_, i) => estadosNames[i]?.color ?? "#000") ?? [],
				},
			],
		}),
		[data],
	);

	return (
		<Bar options={getChartOptions("Volume de negócios por estado")} data={negociosChartData} plugins={chartPlugins} />
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.page
 */
function ReportingCard({ title, page }) {
	const [intervalIndex, setIntervalIndex] = useState(INTERVALS.length - 1);
	const intervalData = useMemo(() => INTERVALS[intervalIndex], [intervalIndex]);
	const { data, isLoading } = useSWR(`${API_URL}/reporting${page}?interval=${intervalData.value}`, fetcher);

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

/**
 * @param {string} title
 * @return {import("chart.js").ChartOptions}
 */
function getChartOptions(title) {
	return {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: title,
				color: "black",
				font: { size: 20 },
			},
			customCanvasBackgroundColor: {
				color: "white",
			},
		},
		scales: {
			x: {
				axis: "x",
				ticks: { color: "black" },
			},
			y: {
				axis: "y",
				ticks: { color: "black" },
			},
		},
	};
}
