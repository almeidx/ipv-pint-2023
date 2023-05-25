export const estadosNames = [
	{ color: "rgba(255, 0, 0, 0.1)", name: "Em espera" },
	{ color: "rgba(255, 0, 0, 0.25)", name: "A validar" },
	{ color: "rgba(255, 0, 0, 0.5)", name: "Em desenvolvimento" },
	{ color: "rgba(255, 0, 0, 0.75)", name: "A finalizar" },
	{ color: "rgba(255, 0, 0, 1)", name: "Finalizado" },
];

/** @param {{ estado: number } | undefined} estadoAtual */
export function resolveNameOfNextEstado(estadoAtual) {
	return estadosNames[
		estadoAtual?.estado !== undefined
			? estadoAtual.estado === estadosNames.length - 1
				? estadoAtual.estado
				: estadoAtual.estado + 1
			: 0
	];
}
