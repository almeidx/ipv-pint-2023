package com.example.pint_mobile.utils

class Beneficio(
    shortContent: String,
    content: String,
    val id: Int,
    dataValidade: String,
    Icon: String
) {
    val titulo = shortContent
    val descricao = content
    val dataValidade = dataValidade
    val icon = Icon

    fun compareToString(text: String): Boolean {
        return titulo.contains(text, true) || descricao.contains(text, true)
    }
}
