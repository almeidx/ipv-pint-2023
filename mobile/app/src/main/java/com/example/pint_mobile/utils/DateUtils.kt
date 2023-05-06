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
