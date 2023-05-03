package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.Layout
import android.view.View
import android.widget.LinearLayout
import android.widget.RelativeLayout
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.bottomsheet.BottomSheetBehavior

class PerfilUtilizadorActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_perfil_utilizador)

        supportActionBar?.title = "Perfil"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.inicio -> {
                    Toast.makeText(applicationContext, "inicio", Toast.LENGTH_SHORT).show()
                    true
                }
                R.id.noticacao -> {
                    Toast.makeText(applicationContext, "notificacao", Toast.LENGTH_SHORT).show()
                    true
                }
                R.id.mais -> {
                    fun gotoLogin(_view: View) {
                        val intent = Intent(this, MainActivity::class.java)
                        startActivity(intent)
                    }
                    true
                }
                else -> false
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun terminarsessao(view: View) {

    }



}

