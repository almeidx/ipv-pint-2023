package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.util.Log
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class EditarCandidaturaActivity : ActivityBase(R.layout.activity_editar_candidatura, "Dados Candidatura") {

    private var nome    : String? = null
    private var titulo  : String? = null
    private var id      : Int? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        nome = intent.getStringExtra("Nome")
        titulo = intent.getStringExtra("Titulo")
        val descricao = intent.getStringExtra("Descricao")
        val data = intent.getStringExtra("Data")
        id = intent.getIntExtra("Id", -1)

        Log.i("EditarCandidaturaActivity", id.toString())

        val nomeCandidato = findViewById<android.widget.TextView>(R.id.nomeCandidatoX)
        nomeCandidato.setText(nome)

        val tituloCandidatura = findViewById<android.widget.TextView>(R.id.tituloCandidaturaEdit)
        tituloCandidatura.setText(titulo)

        val descricaoCandidatura = findViewById<android.widget.TextView>(R.id.descricaoCandidaturaEdit)
        descricaoCandidatura.setText(descricao)

        val dataCandidatura = findViewById<android.widget.TextView>(R.id.dataCandidaturaEdit)
        dataCandidatura.setText(data)
    }

    fun goToNotaEntrevista(view: View) {
        val intent = android.content.Intent(this, EditarNotaEntrevistaActivity::class.java)
        intent.putExtra("Nome", nome)
        intent.putExtra("Titulo", titulo)
        intent.putExtra("Id", id)
        startActivity(intent)
    }

}