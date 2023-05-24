package com.example.pint_mobile.pages.admin

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.widget.EditText
import android.widget.ListView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.admin.edit.CriarBeneficioActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Beneficio
import com.example.pint_mobile.utils.listaBeneficios
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminBeneficiosActivity : ActivityBase(R.layout.activity_admin_beneficios, "Administraçao de Benefícios") {
    private val beneficiosList = ArrayList<Beneficio>()
    private val allBeneficiosList = ArrayList<Beneficio>()
    private lateinit var beneficiosAdapter: BeneficiosActivity.BeneficioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaBeneficios)
        beneficiosAdapter = BeneficiosActivity.BeneficioAdapter(beneficiosList, R.layout.item_beneficio_admin, true)

        lista.adapter = beneficiosAdapter

        listaBeneficios(beneficiosList, allBeneficiosList, beneficiosAdapter, this, true)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                beneficiosList.clear()

                for (beneficio in allBeneficiosList) {
                    if (beneficio.compareToString(search.text.toString())) {
                        beneficiosList.add(beneficio)
                    }
                }
                beneficiosAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun criarBeneficio(view: View) {
        val intent = Intent(this, CriarBeneficioActivity::class.java)
        startActivity(intent)
    }
}
