package com.example.pint_mobile.utils

class Utilizador(val id: Int, val name: String, val mail: String, val lastLoginDate: String?, val tipoUserId: Int, val tipoUserNome: String) {
    val nome = name
    val email = mail
    val dataUltimoLogin = lastLoginDate
    val tipoUtilizador = tipoUserNome

    fun compareToString(text: String): Boolean {
        return nome.contains(text, true)
                || email.contains(text, true)
                || dataUltimoLogin?.contains(text, true) ?: false
                || tipoUtilizador.contains(text, true)
    }
}
