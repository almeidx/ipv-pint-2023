package com.example.pint_mobile.utils

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuItem
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.ContactoActivity
import com.example.pint_mobile.pages.IdeiasActivity
import com.example.pint_mobile.pages.LoginActivity
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.NotificacoesActivity
import com.example.pint_mobile.pages.PerfilActivity
import com.example.pint_mobile.pages.VagasActivity
import com.example.pint_mobile.pages.admin.edit.CriarReuniaoActivity
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.bottomsheet.BottomSheetDialog

open class ActivityBase(private val layout: Int, private val title: String? = null) : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(layout)

        if (title != null) {
            window.statusBarColor = getColor(R.color.tudo)
            supportActionBar?.title = title
            supportActionBar?.setDisplayHomeAsUpEnabled(true)
            window.navigationBarColor = getColor(R.color.tudo)
        } else {
            // As páginas baseadas no login são as únicas sem titulo
            window.statusBarColor = getColor(R.color.loginStatusBarColor)
            window.navigationBarColor = getColor(R.color.loginNavigationBarColor)
        }

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav?.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.inicio -> {
                    val intent = Intent(this, MainActivity::class.java)
                    startActivity(intent)
                    true
                }
                R.id.notificacoes -> {
                    val intent = Intent(this, NotificacoesActivity::class.java)
                    startActivity(intent)
                    true
                }
                R.id.mais -> {
                    val bottomSheetDialog = BottomSheetDialog(this)
                    val bottomSheetView = LayoutInflater.from(this).inflate(R.layout.bottom_sheet_dialog, null)
                    val icon1 = bottomSheetView.findViewById<LinearLayout>(R.id.beneficio)
                    val icon2 = bottomSheetView.findViewById<LinearLayout>(R.id.vagas)
                    val icon3 = bottomSheetView.findViewById<LinearLayout>(R.id.negocio)
                    val icon4 = bottomSheetView.findViewById<LinearLayout>(R.id.contacto)
                    val icon5 = bottomSheetView.findViewById<LinearLayout>(R.id.ideia)
                    val icon6 = bottomSheetView.findViewById<LinearLayout>(R.id.calendario)
                    icon1.setOnClickListener {
                        val intent = Intent(this, BeneficiosActivity::class.java)
                        startActivity(intent)
                    }
                    icon2.setOnClickListener {
                        val intent = Intent(this, VagasActivity::class.java)
                        startActivity(intent)
                    }
                    icon3.setOnClickListener {
                        val intent = Intent(this, NegociosActivity::class.java)
                        startActivity(intent)
                    }
                    icon4.setOnClickListener {
                        val intent = Intent(this, ContactoActivity::class.java)
                        startActivity(intent)
                    }
                    icon5.setOnClickListener {
                        val intent = Intent(this, IdeiasActivity::class.java)
                        startActivity(intent)
                    }
                    icon6.setOnClickListener {
                        val intent = Intent(this, CriarReuniaoActivity::class.java)
                        startActivity(intent)
                    }
                    bottomSheetDialog.setContentView(bottomSheetView)
                    bottomSheetDialog.show()
                    true
                }
                else -> false
            }
        }
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)

        nav.menu.findItem(R.id.inicio).isEnabled = false
        nav.menu.findItem(R.id.notificacoes).isEnabled = true
        nav.menu.findItem(R.id.inicio).isChecked = true
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        val menuInflater = menuInflater
        menuInflater.inflate(R.menu.profile, menu)
        return super.onCreateOptionsMenu(menu)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.profile2 -> {
                val user = getCurrentUser(this)
                if(user != null){
                    val intent = Intent(this, PerfilActivity::class.java)
                    startActivity(intent)
                }
                else{
                    val intent = Intent(this, LoginActivity::class.java)
                    startActivity(intent)
                }
            }
        }
        return super.onOptionsItemSelected(item)
    }
}