package com.example.pint_mobile.utils

class NegocioUser(idNegocio: Int, shortContent: String, content: String, areaNegocio:String, cliente: String, estados: ArrayList<Int>, necessidades: ArrayList<String>   ) {
    val titulo = shortContent
    val descricao = content
    val areaNegocio = areaNegocio
    val cliente = cliente
    val id = idNegocio
    val estados = estados
    val necessidades = necessidades

    fun compareToString(search: String): Boolean {
        return titulo.contains(search, ignoreCase = true) || descricao.contains(search, ignoreCase = true) || areaNegocio.contains(search, ignoreCase = true) || cliente.contains(search, ignoreCase = true)
    }
}
