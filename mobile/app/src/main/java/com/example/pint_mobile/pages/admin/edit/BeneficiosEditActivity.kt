package com.example.pint_mobile.pages.admin.edit

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.admin.AdminBeneficiosActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.deleteBeneficio
import com.google.android.material.textfield.TextInputEditText

class BeneficiosEditActivity : ActivityBase(R.layout.activity_beneficios_edit, "Editar Benefício") {

    private var id = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        id = intent.getIntExtra("id", 0)
        val icon = intent.getStringExtra("icon")
        val dataValidade = intent.getStringExtra("dataValidade")

        val tituloShow = findViewById<TextView>(R.id.titulo)
        tituloShow.text = titulo

        val tituloTextView = findViewById<TextInputEditText>(R.id.tituloBeneficioEdit)
        tituloTextView.setText(titulo)

        val descricaoTextView = findViewById<TextInputEditText>(R.id.descricaoBeneficioEdit)
        descricaoTextView.setText(descricao)

        val dataValidadeTextView = findViewById<TextInputEditText>(R.id.dataValidadeBeneficioEdit)
        dataValidadeTextView.setText(dataValidade)

        val iconTextView = findViewById<TextInputEditText>(R.id.iconBeneficioEdit)
        iconTextView.setText(icon)

    }

    fun removerBeneficio(_view: View){
        deleteBeneficio(id, this)
    }
}
