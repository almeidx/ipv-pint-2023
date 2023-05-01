package com.example.pint_mobile.utils

class Negocio(shortContent: String, content: String, cliente: String,  email: String, criador: String, areaNegocio: String, FuncName:String, FuncEmail: String  ) {
    val titulo = shortContent + ": "
    val descricao = content
    val areaNegocio = "Área de Negócio: " +  areaNegocio
    val criador = criador
    val criadorEmail = email
    val cliente = "Cliente: " + cliente
    val FuncionarioName = "- " + FuncName
    val FuncionarioEmail ="- " + FuncEmail
    fun compareToString(search: String): Boolean {
        return titulo.contains(search, ignoreCase = true) || criadorEmail.contains(search, ignoreCase = true) || descricao.contains(search, ignoreCase = true) || areaNegocio.contains(search, ignoreCase = true) || criador.contains(search, ignoreCase = true) || cliente.contains(search, ignoreCase = true) || FuncionarioName.contains(search, ignoreCase = true) || FuncionarioEmail.contains(search, ignoreCase = true)
    }
}
