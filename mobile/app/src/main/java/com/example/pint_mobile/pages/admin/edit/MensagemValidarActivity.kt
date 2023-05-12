package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners

class MensagemValidarActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_mensagem_validar)

        setupActivityListeners(window, supportActionBar, this, "Validar Mensagem", findViewById(R.id.bottombar))

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val data = intent.getStringExtra("data")
        val registo = intent.getBooleanExtra("registo", false)

        val setRegisto = "${if(registo) "Utilizador Registado" else "Utilizador Não Registado"}"

        val tituloMensagemEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.tituloMensagemEdit)
        tituloMensagemEdit.setText(titulo)
        tituloMensagemEdit.isFocusable = false
        tituloMensagemEdit.isFocusableInTouchMode = false

        val descricaoMensagemEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.descricaoMensagemEdit)
        descricaoMensagemEdit.setText(descricao)
        descricaoMensagemEdit.isFocusable = false
        descricaoMensagemEdit.isFocusableInTouchMode = false

        val dataMensagemEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.dataMensagemEdit)
        dataMensagemEdit.setText(data)
        dataMensagemEdit.isFocusable = false

        val registoMensagemEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.MensagemRegistoEdit)
        registoMensagemEdit.setText(setRegisto)
        registoMensagemEdit.isFocusable = false
        registoMensagemEdit.isFocusableInTouchMode = false

    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}