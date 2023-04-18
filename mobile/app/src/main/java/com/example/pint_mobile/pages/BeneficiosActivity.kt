package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.API
import com.example.pint_mobile.utils.Beneficio

class BeneficiosActivity : AppCompatActivity() {
    private val beneficiosList = ArrayList<Beneficio>()
    private val allBeneficiosList = ArrayList<Beneficio>()
    private lateinit var beneficiosAdapter: BeneficioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_beneficios)

        supportActionBar?.title = "Benefícios"
        supportActionBar?.setHomeButtonEnabled(true)

        val lista = findViewById<ListView>(R.id.listaBeneficios)
        beneficiosAdapter = BeneficioAdapter(beneficiosList)

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

    class BeneficioAdapter(private val beneficios: ArrayList<Beneficio>) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(R.layout.item_beneficio, parent, false)
            val beneficio = beneficios[position]

            val tituloBeneficio = view.findViewById<TextView>(R.id.titulo_beneficio)
            val descricaoBeneficio = view.findViewById<TextView>(R.id.descricao_beneficio)

            tituloBeneficio.text = beneficio.titulo
            descricaoBeneficio.text = beneficio.descricao

            return view
        }

        override fun getItem(position: Int): Beneficio {
            return beneficios[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return beneficios.size
        }
    }
}
