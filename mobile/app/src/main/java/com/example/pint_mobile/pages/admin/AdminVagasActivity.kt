package com.example.pint_mobile.pages.admin

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.widget.EditText
import android.widget.ListView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.VagasActivity
import com.example.pint_mobile.pages.admin.edit.CriarVagaActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Vaga
import com.example.pint_mobile.utils.listaVagas
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminVagasActivity : ActivityBase(R.layout.activity_admin_vagas, "Administração de Vagas") {
    private val vagasList = ArrayList<Vaga>()
    private val allVagasList = ArrayList<Vaga>()
    private lateinit var vagasAdapter: VagasActivity.VagaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaVagas)
        vagasAdapter = VagasActivity.VagaAdapter(vagasList, R.layout.item_vaga_admin, true)

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
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun CriarVaga(view: View) {
        val intent = Intent(this, CriarVagaActivity::class.java)
        startActivity(intent)
    }
}
