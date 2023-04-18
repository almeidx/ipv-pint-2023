package com.example.pint_mobile.utils

class Beneficio(shortContent: String, content: String) {
    val titulo = shortContent
    val descricao = content

    fun compareToString(text: String): Boolean {
        return titulo.contains(text, true) || descricao.contains(text, true)
    }
}
