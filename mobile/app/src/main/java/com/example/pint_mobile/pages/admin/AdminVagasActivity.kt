package com.example.pint_mobile.pages.admin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.KeyEvent
import android.widget.EditText
import android.widget.ListView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.VagasActivity
import com.example.pint_mobile.utils.Vaga
import com.example.pint_mobile.utils.listaVagas
import com.example.pint_mobile.utils.setupActivityListeners

class AdminVagasActivity : AppCompatActivity() {
    private val vagasList = ArrayList<Vaga>()
    private val allVagasList = ArrayList<Vaga>()
    private lateinit var vagasAdapter: VagasActivity.VagaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_vagas)

        setupActivityListeners(window, supportActionBar, this, "Administração de Vagas", findViewById(R.id.bottombar))

        val lista = findViewById<ListView>(R.id.listaVagas)
        vagasAdapter = VagasActivity.VagaAdapter(vagasList, R.layout.item_vaga)

        lista.adapter = vagasAdapter

        listaVagas(vagasList, allVagasList, vagasAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                vagasList.clear()

                for (vaga in allVagasList) {
                    if (vaga.compareToString(search.text.toString())) {
                        vagasList.add(vaga)
                    }
                }

                vagasAdapter.notifyDataSetChanged()

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