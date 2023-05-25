package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.apagarMensagem
import com.google.android.material.bottomnavigation.BottomNavigationView

class MensagemValidarActivity : ActivityBase(R.layout.activity_mensagem_validar, "Validar Mensagem") {

    private var id = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val data = intent.getStringExtra("data")
        val registo = intent.getBooleanExtra("registo", false)
        id = intent.getIntExtra("id", 0)

        val setRegisto = if(registo) "Utilizador Registado" else "Utilizador Não Registado"

        val tituloMensagemEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.tituloMensagemEdit)
        tituloMensagemEdit.setText(titulo)

        val descricaoMensagemEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.descricaoMensagemEdit)
        descricaoMensagemEdit.setText(descricao)

        val dataMensagemEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.dataMensagemEdit)
        dataMensagemEdit.setText(data)

        val registoMensagemEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.utilizadorRegistadoEdit)
        registoMensagemEdit.setText(setRegisto)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun apagarMessage(view: View) {
        apagarMensagem(id, this)
    }


}
