package com.example.pint_mobile.utils

class Negocio(shortContent: String, content: String, cliente: String) {
    val titulo = shortContent + ": "
    val descricao = content
    val cliente = "Cliente: " + cliente




    fun compareToString(text: String): Boolean {
        return titulo.contains(text, true) || cliente.contains(text, true) || descricao.contains(text, true)
    }
}
