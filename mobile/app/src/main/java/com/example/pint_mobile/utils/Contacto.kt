package com.example.pint_mobile.utils

class Contacto(idcliente: Int, value: String, idContacto: Int) {
    val idCliente = idcliente
    val value = value
    val idContacto = idContacto

    fun compareToString(text: String): Boolean {
        return value.contains(text, true)
    }
}