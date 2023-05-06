package com.example.pint_mobile.utils

class Candidatura (nome: String, title: String, description: String, date: String) {
    val nome = nome
    val titulo = title
    val descricao = description
    val data = date

    fun compareToString(text: String): Boolean {
        return nome.contains(text, true) || titulo.contains(text, true) || descricao.contains(text, true) || data.contains(text, true)
    }
}