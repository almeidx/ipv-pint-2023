package com.example.pint_mobile.utils

class vagaCandidatada(
    submissionDate: String,
    shortContent: String,
    content: String,
    amountSlots: Int,
    id: Int,
    status: Int
) {
    val titulo = shortContent
    val descricao = content
    val slots = amountSlots
    val id = id
    val status = status
    val submissionDate = submissionDate

    fun compareToString(text: String): Boolean {
        return titulo.contains(text, true) || descricao.contains(text, true) || slots.toString()
            .contains(text, true)
    }
}