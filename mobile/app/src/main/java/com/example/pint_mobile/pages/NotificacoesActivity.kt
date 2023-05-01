package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.example.pint_mobile.R
import com.google.android.material.bottomnavigation.BottomNavigationView

class NotificacoesActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notificacoes)

        supportActionBar?.title = "Notificações"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.setOnNavigationItemSelectedListener() { item ->
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
                    Toast.makeText(applicationContext, "mais", Toast.LENGTH_SHORT).show()
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
}