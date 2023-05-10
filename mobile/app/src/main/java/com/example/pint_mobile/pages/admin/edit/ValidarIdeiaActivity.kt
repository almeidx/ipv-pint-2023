package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners
import com.google.android.material.textfield.TextInputEditText

class ValidarIdeiaActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_validar_ideia)

        setupActivityListeners(window, supportActionBar, this, "Validar Ideia", findViewById(R.id.bottombar))


        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val data = intent.getStringExtra("data")
        val nome = intent.getStringExtra("criador")

        val tituloIdeiaEdit = findViewById<TextInputEditText>(R.id.tituloIdeiaEdit)
        tituloIdeiaEdit.setText(titulo)
        tituloIdeiaEdit.isFocusable = false
        tituloIdeiaEdit.isFocusableInTouchMode = false

        val descricaoIdeiaEdit = findViewById<TextInputEditText>(R.id.descricaoIdeiaEdit)
        descricaoIdeiaEdit.setText(descricao)
        descricaoIdeiaEdit.isFocusable = false
        descricaoIdeiaEdit.isFocusableInTouchMode = false

        val dataIdeiaEdit = findViewById<TextInputEditText>(R.id.dataIdeiaEdit)
        dataIdeiaEdit.setText(data)
        dataIdeiaEdit.isFocusable = false

        val nomeIdeiaEdit = findViewById<TextInputEditText>(R.id.criadorIdeiaEdit)
        nomeIdeiaEdit.setText(nome)
        nomeIdeiaEdit.isFocusable = false
        nomeIdeiaEdit.isFocusableInTouchMode = false
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}