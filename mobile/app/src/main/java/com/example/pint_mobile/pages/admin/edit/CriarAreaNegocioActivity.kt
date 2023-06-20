package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createAreaNegocio

class CriarAreaNegocioActivity :  ActivityBase(R.layout.activity_criar_area_negocio, "Criar Area Negócio") {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    fun criarAreaNegocio(view: View){
        val nome = findViewById<android.widget.EditText>(R.id.tituloAreaNegocioCriar).text.toString()

        createAreaNegocio(nome, this)
    }
}