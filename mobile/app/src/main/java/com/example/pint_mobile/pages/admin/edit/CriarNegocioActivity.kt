package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class CriarNegocioActivity : ActivityBase(R.layout.activity_criar_negocio, "Criar Negócio") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    fun criarNegocio(view: android.view.View) {
        val titulo = findViewById<android.widget.EditText>(R.id.tituloNegocioCriar)
        val descricao = findViewById<android.widget.EditText>(R.id.descricaoNegocioCriar)
        val area = findViewById<android.widget.EditText>(R.id.areaDoNegocioCriar)
        val cliente = findViewById<android.widget.EditText>(R.id.clienteNegocioCriar)
        val contactoCliente = findViewById<android.widget.EditText>(R.id.contactosDoNegocioCriar)

        val tituloText = titulo.text.toString()
        val descricaoText = descricao.text.toString()
        val areaText = area.text.toString()
        val clienteText = cliente.text.toString()
        val contactoClienteText = contactoCliente.text.toString()
    }
}
