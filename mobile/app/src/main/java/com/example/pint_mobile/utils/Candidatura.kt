package com.example.pint_mobile.utils

class Candidatura(id: Int, nome: String, title: String, date: String) {
    val nome = nome
    val titulo = title
    val data = date
    val id = id

    fun compareToString(text: String): Boolean {
        return nome.contains(text, true) || titulo.contains(text, true) || data.contains(text, true)
    }
}