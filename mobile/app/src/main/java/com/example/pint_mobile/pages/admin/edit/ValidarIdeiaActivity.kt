package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.google.android.material.textfield.TextInputEditText

class ValidarIdeiaActivity : ActivityBase(R.layout.activity_validar_ideia, "Validar Ideia") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val data = intent.getStringExtra("data")
        val nome = intent.getStringExtra("criador")

        val tituloIdeiaEdit = findViewById<TextInputEditText>(R.id.tituloIdeiaEdit)
        tituloIdeiaEdit.setText(titulo)

        val descricaoIdeiaEdit = findViewById<TextInputEditText>(R.id.descricaoIdeiaEdit)
        descricaoIdeiaEdit.setText(descricao)

        val dataIdeiaEdit = findViewById<TextInputEditText>(R.id.dataIdeiaEdit)
        dataIdeiaEdit.setText(data)


        val nomeIdeiaEdit = findViewById<TextInputEditText>(R.id.criadorIdeiaEdit)
        nomeIdeiaEdit.setText(nome)
    }
}
