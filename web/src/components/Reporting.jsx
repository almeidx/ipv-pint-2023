import {
	ArcElement,
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
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Line, Pie } from "react-chartjs-2";
import useSWR from "swr";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { estadosNames } from "../utils/negocios.js";
import { roundRect } from "../utils/roundRect.js";
import { Spinner } from "./Spinner.jsx";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip);

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

/**
 * @typedef {Object} Interval
 * @property {"today"} Day
 * @property {"lastWeek"} Week
 * @property {"lastMonth"} Month
 * @property {"total"} Total
 */
const Interval = {
	Day: "today",
	Week: "lastWeek",
	Month: "lastMonth",
	Total: "total",

	today: "Hoje",
	lastWeek: "Semanal",
	lastMonth: "Mensal",
	total: "Total",
};

const reportingPublicKeys = {
	benefícios: "Benefícios existentes",
	utilizadores: "Utilizadores registados",
	negócios: "Negócios submetidos",
	vagas: "Vagas de emprego",
};

export function Reporting() {
	const { data: reportingData, isLoading } = useSWR(`${API_URL}/reporting`, fetcher);

	const publicSorted = useMemo(
		() =>
			reportingData
				? Object.entries(reportingData)
						.filter(([key]) => Object.keys(reportingPublicKeys).includes(key))
						.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
						.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
				: null,
		[reportingData],
	);

	return (
		<Container className="">
			{isLoading ? (
				<Row className="mx-auto px-3 pb-2 pt-5" style={{ gap: "2rem" }}>
					<Skeleton />
					<Skeleton />
					<Skeleton />
					<Skeleton />
					<Skeleton />
					<Skeleton />
					<Skeleton />
				</Row>
			) : (
				<>
					{/* Global */}
					<Row className="mx-auto px-3 pb-2 pt-5" style={{ gap: "2rem" }}>
						{Object.entries(publicSorted).map(([key, data]) => (
							<ReportingCard
								key={key}
								title={key}
								onIntervalChange={(interval) => data[interval]}
								resolveTitle={(title) => reportingPublicKeys[title]}
								isLoading={isLoading}
							/>
						))}
					</Row>

					{/* Gestor de Negócios */}
					{"porMes" in reportingData.negócios ? (
						<>
							<h2 className="my-3 text-white">Gestão de negócios</h2>

							<Row className="mx-auto mb-4 ms-2" style={{ gap: "2rem" }}>
								<ReportingCard
									title="Negócios associados a si"
									onIntervalChange={() => reportingData.negócios.managed}
									isLoading={isLoading}
									withButton={false}
								/>
							</Row>

							<Row className="mx-auto mb-4">
								<Col md={6}>
									<PorMesChart
										data={reportingData.negócios.porMes}
										title="Negócios criados por mês"
										label="Número de negócios"
									/>
								</Col>

								<Col style={{ maxHeight: "19.8rem" }}>
									<VolumeChart
										data={reportingData.negócios.volumeEstados}
										label="Número de negócios"
										title="Negócios por estado"
										getLabels={(data) =>
											data?.labels.map(
												/** @param {number} estado */ (estado) => estadosNames[estado]?.name ?? "Desconhecido",
											)
										}
										getColors={(data) => data?.data.map((_, i) => estadosNames[i]?.color ?? "#000")}
									/>
								</Col>

								<Col style={{ maxHeight: "19.8rem" }}>
									<VolumeChart
										data={reportingData.negócios.volumeTiposProjeto}
										label="Número de negócios"
										title="Negócios por tipo de projeto"
									/>
								</Col>
							</Row>
						</>
					) : null}

					{/* Gestor de Ideias */}
					{reportingData.ideias && "porMes" in reportingData.ideias ? (
						<>
							<h2 className="my-3 text-white">Gestão de ideias</h2>

							<Row className="mx-auto mb-4 ms-2" style={{ gap: "2rem" }}>
								<ReportingCard
									title="Ideias criadas"
									onIntervalChange={(interval) => reportingData.ideias[interval]}
									isLoading={isLoading}
								/>
								<ReportingCard
									title="Ideias validadas"
									onIntervalChange={() => reportingData.ideias.validadas}
									isLoading={isLoading}
									withButton={false}
								/>
							</Row>

							<Row className="mx-auto mb-4">
								<Col>
									<PorMesChart
										data={reportingData.ideias.porMes}
										title="Ideias enviadas por mês"
										label="Número de ideias"
									/>
								</Col>

								<Col style={{ maxHeight: "19.8rem" }}>
									<VolumeChart
										data={reportingData.ideias.volumeCategorias}
										title="Ideias por categoria"
										label="Número de ideias"
									/>
								</Col>
							</Row>
						</>
					) : null}

					{/* Gestor de Recursos Humanos */}
					{"candidaturas" in reportingData ? (
						<>
							<h2 className="my-3 text-white">Gestão de recursos humanos</h2>

							<Row className="mx-auto mb-4 ms-2" style={{ gap: "2rem" }}>
								<ReportingCard
									title="Candidaturas"
									onIntervalChange={(interval) => reportingData.candidaturas[interval]}
									isLoading={isLoading}
								/>
								<ReportingCard
									title="Reuniões"
									onIntervalChange={(interval) => reportingData.reuniões[interval]}
									isLoading={isLoading}
								/>
							</Row>

							<Row className="mx-auto mb-4">
								<Col>
									<PorMesChart
										data={reportingData.candidaturas.porMes}
										title="Candidaturas submetidas por mês"
										label="Número de candidaturas"
									/>
								</Col>

								<Col>
									<PorMesChart
										data={reportingData.reuniões.porMes}
										title="Reuniões por mês"
										label="Número de reuniões"
									/>
								</Col>
							</Row>
						</>
					) : null}

					{/* Gestor de Conteúdos */}
					{"mensagens" in reportingData ? (
						<>
							<h2 className="my-3 text-white">Gestão de conteúdos</h2>

							<Row className="mx-auto mb-4 ms-2" style={{ gap: "2rem" }}>
								<ReportingCard
									title="Mensagens"
									onIntervalChange={(interval) => reportingData.mensagens[interval]}
									isLoading={isLoading}
								/>
							</Row>
						</>
					) : null}
				</>
			)}
		</Container>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {(interval: Interval) => number} props.onIntervalChange
 * @param {boolean} props.isLoading
 * @param {(title: string) => string} [props.resolveTitle]
 * @param {boolean} [props.withButton=true]
 */
function ReportingCard({ title, resolveTitle, onIntervalChange, isLoading, withButton = true }) {
	const [currentInterval, setCurrentInterval] = useState(Interval.Total);
	const [value, setValue] = useState(onIntervalChange(currentInterval));

	function handleIntervalChange() {
		const newInterval = advancedInterval(currentInterval);

		setCurrentInterval(newInterval);
		setValue(onIntervalChange(newInterval));
	}

	return (
		<Col sm={3} className="rounded-3 bg-white px-4 py-3" style={{ width: "18rem" }}>
			<span className="d-flex justify-content-between">
				<p className="fw-bold mb-0">{resolveTitle?.(title) ?? firstLetterUppercase(title)}</p>

				{withButton ? (
					<Button variant="secondary" onClick={handleIntervalChange} size="sm">
						{Interval[currentInterval]}
					</Button>
				) : null}
			</span>

			{isLoading ? <Spinner size="sm" /> : <p className="mb-0">{value}</p>}
		</Col>
	);
}

/**
 * @param {Object} props
 * @param {any} props.data
 * @param {string} props.title
 * @param {string} props.label
 * @param {(data: any) => string[]} [props.getLabels]
 * @param {(data: any) => string|string[]} [props.getColors]
 */
function VolumeChart({ data, getColors, label, getLabels, title }) {
	const negociosChartData = useMemo(
		/** @return {ChartData} */ () => ({
			labels: getLabels?.(data) ?? data?.labels ?? [],
			datasets: [
				{
					label,
					data: data?.data ?? [],
					backgroundColor: getColors?.(data) ?? [
						"rgba(255, 99, 132, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(255, 206, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(255, 159, 64, 0.2)",
					],
				},
			],
		}),
		[data],
	);

	return <Pie options={getChartOptions(title, false)} data={negociosChartData} plugins={chartPlugins} />;
}

/**
 * @param {Object} props
 * @param {any} props.data
 * @param {string} props.title
 * @param {string} props.label
 * @param {string} [props.color]
 */
function PorMesChart({ data, label, title, color = "#2184c7" }) {
	const reuniõesChartData = useMemo(
		/** @return {import("chart.js").ChartData} */ () => ({
			labels:
				data?.labels.map(
					/** @param {Date|string} date */ (date) =>
						new Date(date).toLocaleDateString("pt-PT", { month: "long", year: "numeric" }),
				) ?? [],
			datasets: [
				{
					label,
					data: data?.data ?? [],
					borderColor: color,
				},
			],
		}),
		[data],
	);

	return <Line options={getChartOptions(title)} data={reuniõesChartData} plugins={chartPlugins} />;
}

function Skeleton() {
	return (
		<Col sm={3} className="rounded-3 bg-white px-4 py-3" style={{ width: "18rem" }}>
			<span className="d-flex justify-content-between">
				<p className="fw-bold mb-0">A carregar...</p>

				<Button variant="secondary" size="sm" disabled>
					{Interval[Interval.Total]}
				</Button>
			</span>

			<Spinner size="sm" />
		</Col>
	);
}

/** @param {Interval} current */
function advancedInterval(current) {
	switch (current) {
		case Interval.Day:
			return Interval.Week;
		case Interval.Week:
			return Interval.Month;
		case Interval.Month:
			return Interval.Total;
		case Interval.Total:
			return Interval.Day;
	}
}

/** @param {string} str */
function firstLetterUppercase(str) {
	return str[0].toUpperCase() + str.slice(1);
}

/**
 * @param {string} title
 * @return {import("chart.js").ChartOptions}
 */
function getChartOptions(title, withScales = true) {
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
		scales: withScales
			? {
					x: {
						axis: "x",
						ticks: { color: "black" },
					},
					y: {
						axis: "y",
						ticks: { color: "black" },
					},
			  }
			: undefined,
	};
}
