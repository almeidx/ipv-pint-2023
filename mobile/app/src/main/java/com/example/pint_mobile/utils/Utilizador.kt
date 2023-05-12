package com.example.pint_mobile.utils

class Utilizador(val id: Int, val name: String, val email: String, val lastLoginDate: String?, val tipoUser: TipoUtilizador) {
    val nome = name
    val dataUltimoLogin = lastLoginDate

    fun compareToString(text: String): Boolean {
        return nome.contains(text, true)
                || email.contains(text, true)
                || dataUltimoLogin?.contains(text, true) ?: false
                || tipoUser.nome.contains(text, true)
    }
}
