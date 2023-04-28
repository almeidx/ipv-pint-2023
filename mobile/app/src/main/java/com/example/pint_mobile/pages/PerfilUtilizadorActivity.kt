package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.Layout
import android.view.View
import android.widget.RelativeLayout
import android.widget.TextView
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.google.android.material.bottomnavigation.BottomNavigationView

class PerfilUtilizadorActivity : AppCompatActivity() {

    val nav = findViewById<BottomNavigationView>(R.id.bottombar)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_perfil_utilizador)

        supportActionBar?.title = "Perfil"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        nav.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.inicio -> {
                    // Lidar com ação de favoritos
                }
                R.id.noticacao -> {
                    // Lidar com ação de agendas
                }
                R.id.mais -> {
                    // Lidar com ação de música
                }
            }
            true
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun terminarsessao(view: View) {

    }


}