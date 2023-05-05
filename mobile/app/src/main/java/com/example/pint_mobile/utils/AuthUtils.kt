package com.example.pint_mobile.utils

import android.content.Context
import org.json.JSONObject

fun getCurrentUser(ctx: Context): User? {
    val sharedPreferences = ctx.getSharedPreferences(AUTH_PREFERENCE_NAME, Context.MODE_PRIVATE)
    val user = sharedPreferences.getString("user", null) ?: return null

    val json = JSONObject(user)
    val tipoUtilizador = json.getJSONObject("tipoUtilizador")

    return User(
        json.getInt("id"),
        json.getString("name"),
        json.getString("email"),
        "", // json.getString("lastLoginDate"),
        tipoUtilizador.getInt("id"),
        tipoUtilizador.getString("name")
    )
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
