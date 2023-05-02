package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import com.example.pint_mobile.R

class Vaga_onCickActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_vaga_on_cick)

        supportActionBar?.title = "Vaga item"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val publico = intent.getStringExtra("publico")
        val slots = intent.getStringExtra("slots")

        val tituloTextView = findViewById<TextView>(R.id.titulo)
        tituloTextView.text = titulo

        val descricaoTextView = findViewById<TextView>(R.id.descricao)
        descricaoTextView.text = descricao

        val publicoTextView = findViewById<TextView>(R.id.publico)
        publicoTextView.text = publico

        val slotsTextView = findViewById<TextView>(R.id.slots)
        slotsTextView.text = slots

    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}