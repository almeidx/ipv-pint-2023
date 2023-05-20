package com.example.pint_mobile.utils

class Contacto (idcliente: Int, value: String) {
    val idCliente = idcliente
    val value = value

    fun compareToString(text: String): Boolean {
        return value.contains(text, true)
    }
}