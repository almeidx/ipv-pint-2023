package com.example.pint_mobile.pages.admin

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.widget.EditText
import android.widget.ImageView
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.admin.edit.CriarBeneficioActivity
import com.example.pint_mobile.utils.Beneficio
import com.example.pint_mobile.utils.listaBeneficios
import com.example.pint_mobile.utils.setupActivityListeners


class AdminBeneficiosActivity : AppCompatActivity() {
    private val beneficiosList = ArrayList<Beneficio>()
    private val allBeneficiosList = ArrayList<Beneficio>()
    private lateinit var beneficiosAdapter: BeneficiosActivity.BeneficioAdapter


    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_beneficios)

        setupActivityListeners(window, supportActionBar, this, "Administração de Benefícios", findViewById(R.id.bottombar))

        val lista = findViewById<ListView>(R.id.listaBeneficios)
        beneficiosAdapter = BeneficiosActivity.BeneficioAdapter(beneficiosList, R.layout.item_beneficio_admin, true)

        lista.adapter = beneficiosAdapter

        listaBeneficios(beneficiosList, allBeneficiosList, beneficiosAdapter, this)

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

    fun criarBeneficio(view: View) {
        val intent = Intent(this, CriarBeneficioActivity::class.java)
        startActivity(intent)
    }
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}