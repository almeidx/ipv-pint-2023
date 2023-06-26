export const estadosNames = [
	{ color: "#afcdea", name: "Em espera" },
	{ color: "#98c3ed", name: "A validar" },
	{ color: "#6aa9e9", name: "Em desenvolvimento" },
	{ color: "#4a9ae9", name: "A finalizar" },
	{ color: "#318ce7", name: "Finalizado" },
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
