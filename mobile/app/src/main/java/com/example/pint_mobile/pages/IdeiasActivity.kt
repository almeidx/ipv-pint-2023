package com.example.pint_mobile.pages

import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createIdea
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.textfield.TextInputEditText

class IdeiasActivity : ActivityBase(R.layout.activity_ideias, "Ideias") {
    lateinit var categoria: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val items = arrayOf(getString(R.string.geral), getString(R.string.estabelecimento), getString(
            R.string.investimento), getString(R.string.negocio))
        val spinner = findViewById<Spinner>(R.id.categorias)

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, items)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedItem = parent.getItemAtPosition(position).toString()
                categoria = selectedItem
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun criarIdeias5(_view: View) {
        val tituloTextView = findViewById<TextInputEditText>(R.id.ideia)
        val titulo = tituloTextView.text.toString()

        if (titulo.isEmpty()) {
            tituloTextView.background = getDrawable(R.drawable.edittext_red_border)
            Toast.makeText(this, "Descricao não pode ser vazia", Toast.LENGTH_SHORT).show()
            return
        }

        createIdea(titulo, categoria, this)
    }
}
