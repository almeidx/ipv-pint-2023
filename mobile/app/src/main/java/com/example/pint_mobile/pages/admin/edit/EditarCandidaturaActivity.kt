package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.util.Log
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.formatDateComHoras

class EditarCandidaturaActivity :
    ActivityBase(R.layout.activity_editar_candidatura, "Dados Candidatura") {

    private var nome: String? = null
    private var titulo: String? = null
    private var id: Int? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        nome = intent.getStringExtra("Nome")
        titulo = intent.getStringExtra("Titulo")
        val data = intent.getStringExtra("Data")
        id = intent.getIntExtra("Id", -1)

        Log.i("EditarCandidaturaActivity", id.toString())

        val nomeCandidato = findViewById<android.widget.TextView>(R.id.nomeCandidatoX)
        nomeCandidato.text = nome

        val tituloCandidatura = findViewById<android.widget.TextView>(R.id.tituloCandidaturaEdit)
        tituloCandidatura.text = titulo

        val data2 = data?.let { formatDateComHoras(it) }
        val dataCandidatura = findViewById<android.widget.TextView>(R.id.dataCandidaturaEdit)
        dataCandidatura.text = data2
    }

    fun goToMarcarReuniao(view: View) {
        val intent = android.content.Intent(this, CriarReuniaoActivity::class.java)
        intent.putExtra("idCandidatura", id)
        startActivity(intent)
        overridePendingTransition(0, 0)
    }

}