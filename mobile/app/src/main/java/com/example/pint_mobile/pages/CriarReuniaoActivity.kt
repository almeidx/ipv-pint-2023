package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.core.content.ContextCompat
import com.example.pint_mobile.R

class CriarReuniaoActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_criar_reuniao)

        supportActionBar?.title = "Criar Reunião"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        window.statusBarColor = ContextCompat.getColor(this, R.color.tudo)
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun criar(_view: View) {

    }
}