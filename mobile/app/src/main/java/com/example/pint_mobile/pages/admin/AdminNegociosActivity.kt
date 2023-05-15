package com.example.pint_mobile.pages.admin

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.widget.EditText
import android.widget.ListView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.admin.edit.CriarNegocioActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Negocio
import com.example.pint_mobile.utils.listaNegocios

class AdminNegociosActivity : ActivityBase(R.layout.activity_admin_negocios, "Administração de Negócios") {
    private val negociosList = ArrayList<Negocio>()
    private val allNegociosList = ArrayList<Negocio>()
    private lateinit var negociosAdapter: NegociosActivity.NegocioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

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
    }

    fun CriarNegocio(view: android.view.View) {
        val intent = Intent(this, CriarNegocioActivity::class.java)
        startActivity(intent)
    }
}
