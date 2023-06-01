package com.example.pint_mobile.utils

import org.ocpsoft.prettytime.PrettyTime
import java.util.Locale
import java.text.SimpleDateFormat

fun formatDate(isoDate: String): String? {
    val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
    val date = dateFormat.parse(isoDate) ?: return null

    val p = PrettyTime(Locale("pt", "PT"))
    return p.format(date)
}

fun formatDateSemHoras(isoDate: String): String? {
    val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
    val outputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    val date = inputFormat.parse(isoDate) ?: return null
    return outputFormat.format(date)
}

fun formatDateComHoras(isoDate: String): String? {
    val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
    val outputFormat = SimpleDateFormat("yyyy-MM-dd '/' HH:mm:ss", Locale.getDefault())
    val date = inputFormat.parse(isoDate) ?: return null
    return outputFormat.format(date)
}

fun pad(n: Int) = n.toString().padStart(2, '0')