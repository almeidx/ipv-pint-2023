package com.example.pint_mobile.utils

class Utilizador(val id: Int, val name: String, val email: String, val lastLoginDate: String?, val tipoUser: TipoUtilizadorEnum, val disabled: Boolean, var cv: String? = null) {
    val nome = name
    val dataUltimoLogin = lastLoginDate
    val disable = disabled

    fun compareToString(text: String): Boolean {
        return nome.contains(text, true)
                || email.contains(text, true)
                || dataUltimoLogin?.contains(text, true) ?: false
    }

}

enum class TipoUtilizadorEnum(val Id: Int, val nome: String){
    Utilizador(1, "Utilizador"),
    GestorIdeias(2, "Gestor de Ideias"),
    GestorRecursosHumanos(3, "Gestor de Recursos Humanos"),
    GestorNegocios(4, "Gestor de Negócios"),
    GestorConteudos(5, "Gestor de Conteúdos"),
    Administrador(6, "Administrador"),
    Colaborador(7, "Colaborador")
}