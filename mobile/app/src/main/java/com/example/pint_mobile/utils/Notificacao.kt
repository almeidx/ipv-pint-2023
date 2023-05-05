package com.example.pint_mobile.utils

class Notificacao (shortContent: String, content: String, data: String ) {
    val titulo = content
    val descricao = shortContent
    val data = data

    fun compareToString(text: String): Boolean {
        return titulo.contains(text, true) || descricao.contains(text, true)
    }
}
