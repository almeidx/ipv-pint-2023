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

export function Reporting() {
	const { data: reportingData, isLoading } = useSWR(`${API_URL}/reporting`, fetcher);

	const sorted = useMemo(
		() =>
			reportingData
				? Object.entries(reportingData)
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
					<Row className="mx-auto px-3 pb-2 pt-5" style={{ gap: "2rem" }}>
						{Object.entries(sorted).map(([key, data]) => (
							<ReportingCard
								key={key}
								title={key}
								onIntervalChange={(interval) => data[interval]}
								isLoading={isLoading}
							/>
						))}
					</Row>

					{"porMes" in sorted.negócios ? (
						<Row className="mx-auto py-3" style={{ gap: "0.5rem" }}>
							<h2 className="text-white">Gestão de negócios:</h2>

							<Col>
								<NegociosPorMesChart data={sorted.negócios.porMes} />
							</Col>

							<Col style={{ maxHeight: "19.5rem" }}>
								<VolumeNegociosPorEstadoChart data={sorted.negócios.volumeEstados} />
							</Col>
						</Row>
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
 */
function ReportingCard({ title, onIntervalChange, isLoading }) {
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
				<p className="fw-bold mb-0">{firstLetterUppercase(title)}</p>

				<Button variant="secondary" onClick={handleIntervalChange} size="sm">
					{Interval[currentInterval]}
				</Button>
			</span>

			{isLoading ? <Spinner size="sm" /> : <p className="mb-0">{value}</p>}
		</Col>
	);
}

function VolumeNegociosPorEstadoChart({ data }) {
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
		<Pie
			options={getChartOptions("Volume de negócios por estado", false)}
			data={negociosChartData}
			plugins={chartPlugins}
		/>
	);
}

function NegociosPorMesChart({ data }) {
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
