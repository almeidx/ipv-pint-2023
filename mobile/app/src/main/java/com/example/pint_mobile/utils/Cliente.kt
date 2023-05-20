package com.example.pint_mobile.utils

class Cliente (val id: Int, val name: String) {

    val clienteId = id
    val nome = name

    fun compareToString(text: String): Boolean {
        return nome.contains(text, true)
    }
}