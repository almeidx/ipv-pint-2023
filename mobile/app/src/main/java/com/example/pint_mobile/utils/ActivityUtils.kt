package com.example.pint_mobile.utils

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.Window
import android.widget.LinearLayout
import androidx.appcompat.app.ActionBar
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.ContactoActivity
import com.example.pint_mobile.pages.IdeiasActivity
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.NotificacoesActivity
import com.example.pint_mobile.pages.VagasActivity
import com.example.pint_mobile.pages.admin.edit.CriarReuniaoActivity
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.bottomsheet.BottomSheetDialog

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
                val bottomSheetDialog = BottomSheetDialog(ctx)
                val bottomSheetView = LayoutInflater.from(ctx).inflate(R.layout.bottom_sheet_dialog, null)
                val icon1 = bottomSheetView.findViewById<LinearLayout>(R.id.beneficio)
                val icon2 = bottomSheetView.findViewById<LinearLayout>(R.id.vagas)
                val icon3 = bottomSheetView.findViewById<LinearLayout>(R.id.negocio)
                val icon4 = bottomSheetView.findViewById<LinearLayout>(R.id.contacto)
                val icon5 = bottomSheetView.findViewById<LinearLayout>(R.id.ideia)
                val icon6 = bottomSheetView.findViewById<LinearLayout>(R.id.calendario)
                icon1.setOnClickListener {
                    val intent = Intent(ctx, BeneficiosActivity::class.java)
                    ctx.startActivity(intent)
                }
                icon2.setOnClickListener {
                    val intent = Intent(ctx, VagasActivity::class.java)
                    ctx.startActivity(intent)
                }
                icon3.setOnClickListener {
                    val intent = Intent(ctx, NegociosActivity::class.java)
                    ctx.startActivity(intent)
                }
                icon4.setOnClickListener {
                    val intent = Intent(ctx, ContactoActivity::class.java)
                    ctx.startActivity(intent)
                }
                icon5.setOnClickListener {
                    val intent = Intent(ctx, IdeiasActivity::class.java)
                    ctx.startActivity(intent)
                }
                icon6.setOnClickListener {
                    val intent = Intent(ctx, CriarReuniaoActivity::class.java)
                    ctx.startActivity(intent)
                }
                bottomSheetDialog.setContentView(bottomSheetView)
                bottomSheetDialog.show()
                true
            }
            else -> false
        }
    }
}
