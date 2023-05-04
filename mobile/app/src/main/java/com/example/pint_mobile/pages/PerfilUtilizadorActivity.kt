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
import androidx.core.content.ContextCompat
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog

class PerfilUtilizadorActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_perfil_utilizador)

        window.statusBarColor = ContextCompat.getColor(this, R.color.tudo)
        supportActionBar?.title = "Perfil"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)


        nav.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.inicio -> {

                    true
                }
                R.id.noticacao -> {
                    Toast.makeText(applicationContext, "notificacao", Toast.LENGTH_SHORT).show()
                    true
                }
                R.id.mais -> {
                    val bottomSheetDialog = BottomSheetDialog(this)
                    val bottomSheetView = layoutInflater.inflate(R.layout., null)
                    bottomSheetDialog.setContentView(bottomSheetView)
                    bottomSheetDialog.show()
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

