package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners

class EditNegocioActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_negocio)

        setupActivityListeners(window, supportActionBar, this, "Editar Negócio", findViewById(R.id.bottombar))

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val cliente = intent.getStringExtra("cliente")
        val criador = intent.getStringExtra("criador")
        val status = intent.getStringExtra("status")

        val tituloEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.tituloNegocioEdit)
        tituloEdit.setText(titulo)
        tituloEdit.isFocusable = false
        tituloEdit.isFocusableInTouchMode = false

        val descricaoEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.descricaoNegocioEdit)
        descricaoEdit.setText(descricao)
        descricaoEdit.isFocusable = false
        descricaoEdit.isFocusableInTouchMode = false

        val clienteEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.clienteNegocioEdit)
        clienteEdit.setText(cliente)
        clienteEdit.isFocusable = false
        clienteEdit.isFocusableInTouchMode = false

        val criadorEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.criadorNegocioEdit)
        criadorEdit.setText(criador)
        criadorEdit.isFocusable = false
        criadorEdit.isFocusableInTouchMode = false

        val statusEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.statusNegocioEdit)
        statusEdit.setText(status)


    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}