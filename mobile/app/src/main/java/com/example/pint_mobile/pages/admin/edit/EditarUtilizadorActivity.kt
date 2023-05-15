package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.listaTipoUtilizador

class EditarUtilizadorActivity : ActivityBase(R.layout.activity_editar_utilizador, "Editar Utilizador") {
    lateinit var cargo: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nome = intent.getStringExtra("nome")
        val email = intent.getStringExtra("email")
        val cargoId = intent.getIntExtra("cargoId", 0)

        val nomeEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.NomeUtilizadorEdit)
        nomeEdit.setText(nome)

        val emailEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.EmailUtilizadorEdit)
        emailEdit.setText(email)

        val spinner = findViewById<Spinner>(R.id.cargos)

        listaTipoUtilizador(this) { lista ->
            val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, lista.map {
                it.nome
            })
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinner.adapter = adapter

            spinner.setSelection(cargoId - 1)
        }

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedItem = parent.getItemAtPosition(position).toString()
                cargo = selectedItem
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
    }
}
