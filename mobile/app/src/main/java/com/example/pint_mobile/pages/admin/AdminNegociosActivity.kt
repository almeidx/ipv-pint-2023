package com.example.pint_mobile.pages.admin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.KeyEvent
import android.widget.EditText
import android.widget.ListView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.utils.Negocio
import com.example.pint_mobile.utils.setupActivityListeners
import com.example.pint_mobile.utils.listaNegocios

class AdminNegociosActivity : AppCompatActivity() {
    private val negociosList = ArrayList<Negocio>()
    private val allNegociosList = ArrayList<Negocio>()
    private lateinit var negociosAdapter: NegociosActivity.NegocioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_negocios)

        setupActivityListeners(window, supportActionBar, this, "Administração de Negócios", findViewById(R.id.bottombar))

        val lista = findViewById<ListView>(R.id.listaNegocios)
        negociosAdapter = NegociosActivity.NegocioAdapter(negociosList, R.layout.item_negocio_admin)

        lista.adapter = negociosAdapter

        listaNegocios(negociosList, allNegociosList, negociosAdapter, this)

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

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}
