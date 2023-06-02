import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		chunkSplitPlugin({
			customSplitting: {
				admin: [/src\/pages\/admin/],
				calendar: [/node_modules\/@fullcalendar/, /node_modules\/bootstrap-icons/],
				form: [/node_modules\/formik/, /node_modules\/yup/],
				icons: [/node_modules\/@react-icons\/all\-files/],
				chart: [/node_modules\/chart.js/, /node_modules\/react-chartjs-2/],
			},
		}),
	],
	// build: {
	// 	target: "esnext",
	// },
});
