/**
 * Função que verifica se o botão deve estar desativado num formulário do Formik
 *
 * @param {import("formik").FormikErrors} errors - Objeto de erros do Formik
 * @param {import("formik").FormikTouched} touched - Objeto de campos tocados do Formik
 */
export function formikButtonDisabled(errors, touched) {
	return Object.keys(errors).length > 0 || Object.keys(touched).length === 0;
}
