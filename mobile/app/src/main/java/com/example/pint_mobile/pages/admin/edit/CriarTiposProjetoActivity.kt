package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createTipoProjeto

class CriarTiposProjetoActivity : ActivityBase(R.layout.activity_criar_tipos_projeto, "Criar Tipos de Projeto ") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    fun criarTiposProjeto(view: View){
        val nome = findViewById<android.widget.EditText>(R.id.tituloTipoProjetoEditText).text.toString()

        createTipoProjeto(nome, this)
    }
}