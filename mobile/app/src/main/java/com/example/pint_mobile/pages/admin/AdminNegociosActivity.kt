package com.example.pint_mobile.pages.admin

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.Spinner
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.admin.edit.CriarNegocioActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Negocio
import com.example.pint_mobile.utils.listaNegocios
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminNegociosActivity : ActivityBase(R.layout.activity_admin_negocios, "Administração de Oportunidades") {
    private val negociosList = ArrayList<Negocio>()
    private val allNegociosList = ArrayList<Negocio>()
    private lateinit var negociosAdapter: NegociosActivity.NegocioAdapter

    lateinit var categoria: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val items = arrayOf("Titulo(Ascendente)", "Titulo(Descendente)", "Data(Ascendente)", "Data(Descendente)", "Area de negócio", "Estado")
        val spinner = findViewById<Spinner>(R.id.ordenar)

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, items)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedItem = parent.getItemAtPosition(position).toString()
                categoria = selectedItem

                ordenarListaPorCategoria(categoria)
            }
            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        val lista = findViewById<ListView>(R.id.listaNegocios)
        negociosAdapter = NegociosActivity.NegocioAdapter(negociosList, R.layout.item_negocio_admin, true)

        lista.adapter = negociosAdapter

        listaNegocios(negociosList, allNegociosList, negociosAdapter, this, true)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                negociosList.clear()

                for (negocio in allNegociosList) {
                    if (negocio.compareToString(search.text.toString())) {
                        negociosList.add(negocio)
                    }
                }
                negociosAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun ordenarListaPorCategoria(categoria: String) {

        when (categoria) {
            "Titulo(Ascendente)" -> negociosList.sortBy { it.titulo  }  // Ordena por título em ordem ascendente
            "Titulo(Descendente)" -> negociosList.sortByDescending { it.titulo } // Ordena por título em ordem descendente
            "Data(Ascendente)" -> negociosList.sortBy { it.dataCriacao} // Ordena por data em ordem ascendente
            "Data(Descendente)" -> negociosList.sortByDescending { it.dataCriacao } // Ordena por data em ordem descendente
            "Area de negócio" -> negociosList.sortBy { it.areaNegocio } // Ordena por área de negócio
            "Estado" -> negociosList.sortBy { if (it.estado.isNotEmpty()) it.estado.last() else 0 } // Ordena por estado
            else -> return // Não faz nada
        }
        negociosAdapter.notifyDataSetChanged()
    }

    fun CriarNegocio(view: android.view.View) {
        val intent = Intent(this, CriarNegocioActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }
}
