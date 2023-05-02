package com.example.pint_mobile.utils

class Negocio(shortContent: String, content: String, cliente: String,  email: String, criador: String, areaNegocio: String, FuncName:String, FuncEmail: String, centroTrabalhoName: String, centroTrabalhoLocation: String, centroTrabalhoPostalCode: String, centroTrabalhoAdress: String ) {
    val titulo = shortContent + ": "
    val descricao = content
    val areaNegocio = "Área de Negócio: " +  areaNegocio
    val criador = criador
    val criadorEmail = email
    val cliente = "Cliente: " + cliente
    val FuncionarioName = "- " + FuncName
    val FuncionarioEmail ="- " + FuncEmail
    val centroTrabalhoName = centroTrabalhoName
    val centroTrabalhoLocation = centroTrabalhoLocation
    val centroTrabalhoPostalCode = centroTrabalhoPostalCode
    val centroTrabalhoAdress = centroTrabalhoAdress
    fun compareToString(search: String): Boolean {
        return titulo.contains(search, ignoreCase = true) || criadorEmail.contains(search, ignoreCase = true) || descricao.contains(search, ignoreCase = true) || areaNegocio.contains(search, ignoreCase = true) || criador.contains(search, ignoreCase = true) || cliente.contains(search, ignoreCase = true) || FuncionarioName.contains(search, ignoreCase = true) || FuncionarioEmail.contains(search, ignoreCase = true) || centroTrabalhoName.contains(search, ignoreCase = true) || centroTrabalhoLocation.contains(search, ignoreCase = true) || centroTrabalhoPostalCode.contains(search, ignoreCase = true) || centroTrabalhoAdress.contains(search, ignoreCase = true)
    }
}
