package com.example.pint_mobile.utils

class Ideia(
    content: String,
    categoria: String,
    dataCriacao: String,
    criador: String,
    Id: Int,
    Validacao: Boolean
) {
    val descricao = content
    val categoria = categoria
    val dataCriacao = formatDate(dataCriacao)
    val criador = criador
    val id = Id
    val validada = Validacao

    fun compareToString(search: String): Boolean {
        return descricao.contains(search, ignoreCase = true) || categoria.contains(
            search,
            ignoreCase = true
        ) || criador.contains(search, ignoreCase = true)
    }
}
