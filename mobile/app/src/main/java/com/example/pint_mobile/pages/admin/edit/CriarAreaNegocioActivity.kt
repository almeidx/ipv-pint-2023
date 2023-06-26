package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.view.View
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createAreaNegocio

class CriarAreaNegocioActivity :
    ActivityBase(R.layout.activity_criar_area_negocio, "Criar Area Negócio") {

    fun criarAreaNegocio(view: View) {
        val nome = findViewById<android.widget.EditText>(R.id.tituloAreaNegocioCriar)

        val nomeString = nome.text.toString()

        if (nomeString.isEmpty()) {
            nome.setBackgroundResource(R.drawable.edittext_red_border)
            Toast.makeText(this, "Nome não pode ser vazio", Toast.LENGTH_SHORT).show()
            return
        }

        createAreaNegocio(nomeString, this)
    }
}