package com.example.pint_mobile.utils

class Mensagem ( name: String, content: String, date: String, registed: Boolean){

    val nome = name
    val conteudo = content
    val data = formatDate(date)!!
    val registado = registed

    fun compareToString(search: String): Boolean {
        return nome.contains(search, ignoreCase = true) ||
                conteudo.contains(search, ignoreCase = true) ||
                data.contains(search, ignoreCase = true) ||
                registado.toString().contains(search, ignoreCase = true)
    }

}