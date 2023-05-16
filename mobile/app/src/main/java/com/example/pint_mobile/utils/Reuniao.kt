package com.example.pint_mobile.utils

class Reuniao ( title: String, description: String, subject: String, date: String, duration: String, Id: Int , Candidatura:String , Negocio:String) {

    val title = title
    val description = description
    val subject = subject
    val date = formatDate(date)!!
    val duration = duration
    val id = Id
    val candidatura = Candidatura
    val negocio = Negocio

    fun compareToString(search: String): Boolean {
        return title.contains(search, true) || description.contains(search, true) || subject.contains(search, true) || date.contains(search, true) || duration.contains(search, true)
    }
}