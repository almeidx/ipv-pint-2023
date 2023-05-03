package com.example.pint_mobile.pages.Admin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.KeyEvent
import android.widget.EditText
import android.widget.ListView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.utils.API
import com.example.pint_mobile.utils.Beneficio

class AdminBeneficiosActivity : AppCompatActivity() {

    private val beneficiosList = ArrayList<Beneficio>()
    private val allBeneficiosList = ArrayList<Beneficio>()
    private lateinit var beneficiosAdapter: BeneficiosActivity.BeneficioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_beneficios)

        supportActionBar?.title = "Beneficios Administração"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val lista = findViewById<ListView>(R.id.listaBeneficios)
        beneficiosAdapter = BeneficiosActivity.BeneficioAdapter(beneficiosList, R.layout.item_beneficio_admin)

        lista.adapter = beneficiosAdapter

        API.listaBeneficios(beneficiosList, allBeneficiosList, beneficiosAdapter, this)

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

    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}