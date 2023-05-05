package com.example.pint_mobile.utils

import android.content.Context
import android.content.Intent
import android.view.Window
import androidx.appcompat.app.ActionBar
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.NotificacoesActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

fun setupActivityListeners(
    window: Window,
    supportActionBar: ActionBar?,
    ctx: Context,
    title: String? = null,
    nav: BottomNavigationView? = null
) {
    if (title != null) {
        window.statusBarColor = ctx.getColor(R.color.tudo)
        supportActionBar?.title = title
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    } else {
        // As páginas baseadas no login são as únicas sem titulo
        window.statusBarColor = ctx.getColor(R.color.loginStatusBarColor)
    }

    nav?.setOnItemSelectedListener { item ->
        when (item.itemId) {
            R.id.inicio -> {
                val intent = Intent(ctx, MainActivity::class.java)
                ctx.startActivity(intent)
                true
            }
            R.id.notificacoes -> {
                val intent = Intent(ctx, NotificacoesActivity::class.java)
                ctx.startActivity(intent)
                true
            }
            R.id.mais -> {
                true
            }
            else -> false
        }
    }
}
