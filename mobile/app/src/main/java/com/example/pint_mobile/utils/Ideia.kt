package com.example.pint_mobile.utils

class Ideia (content: String, categoria: String,dataCriacao: String,  criador: String,) {
    val descricao = content
    val categoria = categoria
    val dataCriacao = dataCriacao
    val criador = criador

    fun compareToString(search: String): Boolean {
        return descricao.contains(search, ignoreCase = true) || categoria.contains(search, ignoreCase = true) || dataCriacao.contains(search, ignoreCase = true) || criador.contains(search, ignoreCase = true)
    }
}
