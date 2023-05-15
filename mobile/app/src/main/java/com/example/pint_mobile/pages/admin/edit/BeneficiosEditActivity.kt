package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.google.android.material.textfield.TextInputEditText

class BeneficiosEditActivity : ActivityBase(R.layout.activity_beneficios_edit, "Editar Benefício") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")

        val tituloShow = findViewById<TextView>(R.id.titulo)
        tituloShow.text = titulo

        val tituloTextView = findViewById<TextInputEditText>(R.id.tituloBeneficioEdit)
        tituloTextView.setText(titulo)

        val descricaoTextView = findViewById<TextInputEditText>(R.id.descricaoBeneficioEdit)
        descricaoTextView.setText(descricao)
    }
}
