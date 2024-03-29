package com.example.pint_mobile.utils

class Vaga(
    shortContent: String,
    content: String,
    public: Boolean,
    amountSlots: Int,
    id: Int,
    status: Int
) {
    val titulo = shortContent
    val descricao = content
    val publico = public
    val slots = amountSlots
    val id = id
    val status = status

    fun compareToString(text: String): Boolean {
        return titulo.contains(text, true) || descricao.contains(text, true) || slots.toString()
            .contains(text, true)
    }
}
