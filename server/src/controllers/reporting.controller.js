const { oneLine } = require("common-tags");
const deepmerge = require("deepmerge");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../database/index.js");
const { checkPermissionStandalone } = require("../middleware/authentication.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async read(req, res) {
		const promises = [
			sequelize.query(
				oneLine`
					SELECT CAST(COUNT(*) AS INT) as "benefícios.total", (
						SELECT CAST(COUNT(*) AS INT)
						FROM beneficios
						WHERE "DATA_CRIACAO_BENEFICIO" >= NOW() - INTERVAL '1d'
					) as "benefícios.today", (
						SELECT CAST(COUNT(*) AS INT)
						FROM beneficios
						WHERE "DATA_CRIACAO_BENEFICIO" >= NOW() - INTERVAL '7d'
					) as "benefícios.lastWeek", (
						SELECT CAST(COUNT(*) AS INT)
						FROM beneficios
						WHERE "DATA_CRIACAO_BENEFICIO" >= NOW() - INTERVAL '30d'
					) as "benefícios.lastMonth", (
						SELECT CAST(COUNT(*) AS INT)
						FROM utilizadores
					) as "utilizadores.total", (
						SELECT CAST(COUNT(*) AS INT)
						FROM utilizadores
						WHERE "DATA_CRIACAO" >= NOW() - INTERVAL '1d'
					) as "utilizadores.today", (
						SELECT CAST(COUNT(*) AS INT)
						FROM utilizadores
						WHERE "DATA_CRIACAO" >= NOW() - INTERVAL '7d'
					) as "utilizadores.lastWeek", (
						SELECT CAST(COUNT(*) AS INT)
						FROM utilizadores
						WHERE "DATA_CRIACAO" >= NOW() - INTERVAL '30d'
					) as "utilizadores.lastMonth", (
						SELECT CAST(COUNT(*) AS INT)
						FROM negocios
					) as "negócios.total", (
						SELECT CAST(COUNT(*) AS INT)
						FROM negocios
						WHERE "DATA_CRIACAO" >= NOW() - INTERVAL '1d'
					) as "negócios.today", (
						SELECT CAST(COUNT(*) AS INT)
						FROM negocios
						WHERE "DATA_CRIACAO" >= NOW() - INTERVAL '7d'
					) as "negócios.lastWeek", (
						SELECT CAST(COUNT(*) AS INT)
						FROM negocios
						WHERE "DATA_CRIACAO" >= NOW() - INTERVAL '30d'
					) as "negócios.lastMonth", (
						SELECT CAST(COUNT(*) AS INT)
						FROM vagas
					) as "vagas.total", (
						SELECT CAST(COUNT(*) AS INT)
						FROM vagas
						WHERE "DATA_CRIACAO_VAGA" >= NOW() - INTERVAL '1d'
					) as "vagas.today", (
						SELECT CAST(COUNT(*) AS INT)
						FROM vagas
						WHERE "DATA_CRIACAO_VAGA" >= NOW() - INTERVAL '7d'
					) as "vagas.lastWeek", (
						SELECT CAST(COUNT(*) AS INT)
						FROM vagas
						WHERE "DATA_CRIACAO_VAGA" >= NOW() - INTERVAL '30d'
					) as "vagas.lastMonth"
					FROM beneficios
				`,
				{
					nest: true,
					type: QueryTypes.SELECT,
				},
			),
		];

		if (checkPermissionStandalone(req, res, TipoUtilizadorEnum.GestorRecursosHumanos, false)) {
			promises.push(
				sequelize.query(
					oneLine`
						SELECT CAST(COUNT(*) AS INT) as "candidaturas.total", (
							SELECT CAST(COUNT(*) AS INT)
							FROM candidaturas
						) as "candidaturas.total", (
							SELECT CAST(COUNT(*) AS INT)
							FROM candidaturas
							WHERE "DATA_SUBMISSAO" >= NOW() - INTERVAL '1d'
						) as "candidaturas.today", (
							SELECT CAST(COUNT(*) AS INT)
							FROM candidaturas
							WHERE "DATA_SUBMISSAO" >= NOW() - INTERVAL '7d'
						) as "candidaturas.lastWeek", (
							SELECT CAST(COUNT(*) AS INT)
							FROM candidaturas
							WHERE "DATA_SUBMISSAO" >= NOW() - INTERVAL '30d'
						) as "candidaturas.lastMonth", (
							SELECT CAST(COUNT(*) AS INT)
							FROM reunioes
						) as "reuniões.total", (
							SELECT CAST(COUNT(*) AS INT)
							FROM reunioes
							WHERE "DATA_INICIO" >= NOW() - INTERVAL '1d'
						) as "reuniões.today", (
							SELECT CAST(COUNT(*) AS INT)
							FROM reunioes
							WHERE "DATA_INICIO" >= NOW() - INTERVAL '7d'
						) as "reuniões.lastWeek", (
							SELECT CAST(COUNT(*) AS INT)
							FROM reunioes
							WHERE "DATA_INICIO" >= NOW() - INTERVAL '30d'
						) as "reuniões.lastMonth"
						FROM candidaturas
					`,
					{
						nest: true,
						type: QueryTypes.SELECT,
					},
				),
				getDataPerMonth("candidaturas", "DATA_SUBMISSAO", "candidaturas"),
				getDataPerMonth("reunioes", "DATA_INICIO", "reuniões"),
			);
		}

		if (checkPermissionStandalone(req, res, TipoUtilizadorEnum.GestorNegocios, false)) {
			promises.push(
				sequelize.query(
					oneLine`
						SELECT CAST(COUNT(*) AS INT) as "negócios.managed"
						FROM NEGOCIOS
						WHERE "UTI_ID_USER" = :userId
					`,
					{
						replacements: { userId: req.user?.id ?? 17 },
						nest: true,
						type: QueryTypes.SELECT,
					},
				),
				getDataPerMonth("negocios", "DATA_CRIACAO", "negócios"),
				getVolumeData(
					oneLine`
						SELECT "ESTADO" as label, CAST(COUNT(*) AS INT) AS data
						FROM estados_negocios
						INNER JOIN negocios
							ON negocios."ID_OPORTUNIDADE" = estados_negocios."ID_OPORTUNIDADE"
						GROUP BY label
						ORDER BY label ASC
					`,
					"negócios",
					"volumeEstados",
				),
				getVolumeData(
					oneLine`
						SELECT negocios."ID_TIPO_PROJETO" as tipo, CAST(COUNT(*) AS INT) AS data, "NOME_TIPO_PROJETO" as label
						FROM negocios INNER JOIN tipos_de_projetos
							ON negocios."ID_TIPO_PROJETO" = tipos_de_projetos."ID_TIPO_PROJETO"
						GROUP BY tipo, "NOME_TIPO_PROJETO"
						ORDER BY tipo
					`,
					"negócios",
					"volumeTiposProjeto",
				),
			);
		}

		if (checkPermissionStandalone(req, res, TipoUtilizadorEnum.GestorIdeias, false)) {
			promises.push(
				sequelize.query(
					oneLine`
						SELECT CAST(COUNT(*) AS INT) as "ideias.validadas", (
							SELECT CAST(COUNT(*) AS INT)
							FROM ideias
						) as "ideias.total", (
							SELECT CAST(COUNT(*) AS INT)
							FROM ideias
							WHERE "DATA_CRIACAO_IDEIA" >= NOW() - INTERVAL '1d'
						) as "ideias.today", (
							SELECT CAST(COUNT(*) AS INT)
							FROM ideias
							WHERE "DATA_CRIACAO_IDEIA" >= NOW() - INTERVAL '7d'
						) as "ideias.lastWeek", (
							SELECT CAST(COUNT(*) AS INT)
							FROM ideias
							WHERE "DATA_CRIACAO_IDEIA" >= NOW() - INTERVAL '30d'
						) as "ideias.lastMonth"
						FROM IDEIAS
						WHERE "IDEIA_VALIDADA" = TRUE
					`,
					{
						nest: true,
						type: QueryTypes.SELECT,
					},
				),
				getDataPerMonth("ideias", "DATA_CRIACAO_IDEIA", "ideias"),
				getVolumeData(
					oneLine`
						SELECT ideias."CATEGORIA" as label, CAST(COUNT(*) AS INT) AS data
						FROM ideias
						GROUP BY label
						ORDER BY label
					`,
					"ideias",
					"volumeCategorias",
				),
			);
		}

		if (checkPermissionStandalone(req, res, TipoUtilizadorEnum.GestorConteudos, false)) {
			promises.push(
				sequelize.query(
					oneLine`
						SELECT CAST(COUNT(*) AS INT) as "mensagens.total", (
							SELECT CAST(COUNT(*) AS INT)
							FROM mensagens
							WHERE "DATA_CRIACAO_MENSAGEM" >= NOW() - INTERVAL '1d'
						) as "mensagens.today", (
							SELECT CAST(COUNT(*) AS INT)
							FROM mensagens
							WHERE "DATA_CRIACAO_MENSAGEM" >= NOW() - INTERVAL '7d'
						) as "mensagens.lastWeek", (
							SELECT CAST(COUNT(*) AS INT)
							FROM mensagens
							WHERE "DATA_CRIACAO_MENSAGEM" >= NOW() - INTERVAL '30d'
						) as "mensagens.lastMonth"
						FROM mensagens
					`,
					{
						nest: true,
						type: QueryTypes.SELECT,
					},
				),
			);
		}

		const results = await Promise.all(promises);
		const merged = deepmerge.all(results.map((result) => result[0]));

		res.json(merged);
	},
};

/**
 * @param {string} query
 * @param {string} name
 * @param {string} key
 */
async function getVolumeData(query, name, key) {
	const queryData = await sequelize.query(query, {
		type: QueryTypes.SELECT,
	});

	const result = {
		labels: [],
		data: [],
	};

	for (const { data, label } of queryData) {
		result.labels.push(label);
		result.data.push(data);
	}

	return [{ [name]: { [key]: result } }];
}

/**
 * @param {string} table
 * @param {string} column
 * @param {string} name Nome da key do objeto que é retornado
 */
async function getDataPerMonth(table, column, name) {
	const result = await sequelize.query(
		oneLine`
			SELECT mes, CAST(COUNT(*) AS INT) AS quantidade
			FROM (
				SELECT DATE_TRUNC('month', "${column}") AS mes
				FROM ${table}
				WHERE "${column}" >= NOW() - INTERVAL '1y'
			) as subquery
			GROUP BY mes
		`,
		{
			type: QueryTypes.SELECT,
		},
	);

	const data = [];
	const labels = [];
	for (let i = 11; i >= 0; i--) {
		const month = new Date();
		month.setMonth(month.getMonth() - i);
		month.setDate(1);
		month.setUTCHours(0, 0, 0, 0);

		const entry = result.find(
			(e) => e.mes.getMonth() === month.getMonth() && e.mes.getFullYear() === month.getFullYear(),
		);

		labels.push(month);
		data.push(entry?.quantidade ?? 0);

		if (entry) {
			result.splice(result.indexOf(entry), 1);
		}
	}

	return [{ [name]: { porMes: { data, labels } } }];
}
