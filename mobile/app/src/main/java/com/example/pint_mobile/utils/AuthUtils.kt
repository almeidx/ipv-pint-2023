package com.example.pint_mobile.utils

import android.content.Context
import org.json.JSONObject

fun getCurrentUser(ctx: Context): Utilizador? {
    val sharedPreferences = ctx.getSharedPreferences(AUTH_PREFERENCE_NAME, Context.MODE_PRIVATE)
    val user = sharedPreferences.getString("user", null) ?: return null

    val json = JSONObject(user)
    val tipoUtilizador = json.getJSONObject("tipoUtilizador")

    return Utilizador(
        json.getInt("id"),
        json.getString("name"),
        json.getString("email"),
        "", // json.getString("lastLoginDate"),
        when (tipoUtilizador.getInt("id")) {
            1 -> TipoUtilizadorEnum.Utilizador
            2 -> TipoUtilizadorEnum.GestorIdeias
            3 -> TipoUtilizadorEnum.GestorRecursosHumanos
            4 -> TipoUtilizadorEnum.GestorNegocios
            5 -> TipoUtilizadorEnum.GestorConteudos
            6 -> TipoUtilizadorEnum.Administrador
            else -> throw IllegalArgumentException("Invalid id")
        },
        false, // json.getBoolean("disabled"),
        json.getString("cv")
    )
}

fun getCookie(cookie: String): String {
    return "connect.sid=$cookie"
}
fun getCookie(ctx: Context): String? {
    val cookie = getCookieValue(ctx) ?: return null
    return "connect.sid=$cookie"
}

fun getCookieValue(ctx: Context): String? {
    val sharedPreferences = ctx.getSharedPreferences(AUTH_PREFERENCE_NAME, Context.MODE_PRIVATE)
    return sharedPreferences.getString("cookie", null)
}

fun deleteCurrentUser(ctx: Context) {
    ctx.deleteSharedPreferences(AUTH_PREFERENCE_NAME)
}

fun saveCurrentUser(
    ctx: Context,
    user: JSONObject,
    cookie: String
) {
    val sharedPreferences =
        ctx.getSharedPreferences(AUTH_PREFERENCE_NAME, Context.MODE_PRIVATE)
    val editor = sharedPreferences.edit()

    editor.putString("cookie", cookie)
    editor.putString("user", user.toString())

    editor.apply()
}
