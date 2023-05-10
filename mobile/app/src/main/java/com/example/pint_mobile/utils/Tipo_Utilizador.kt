package com.example.pint_mobile.utils

class Tipo_Utilizador ( val nome: String) {

    val tipoUtilizador = nome


    fun compareToString(text: String): Boolean {
        return tipoUtilizador.contains(text, true)
    }
}