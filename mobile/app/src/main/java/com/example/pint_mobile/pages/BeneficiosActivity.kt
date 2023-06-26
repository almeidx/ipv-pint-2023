package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.BaseAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.edit.BeneficiosEditActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Beneficio
import com.example.pint_mobile.utils.listaBeneficios
import com.google.android.material.bottomnavigation.BottomNavigationView

class BeneficiosActivity : ActivityBase(R.layout.activity_beneficios, "Benefícios") {
    private val beneficiosList = ArrayList<Beneficio>()
    private val allBeneficiosList = ArrayList<Beneficio>()
    private lateinit var beneficiosAdapter: BeneficioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaBeneficios)
        beneficiosAdapter = BeneficioAdapter(beneficiosList, R.layout.item_beneficio)

        lista.adapter = beneficiosAdapter

        listaBeneficios(beneficiosList, allBeneficiosList, beneficiosAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnEditorActionListener { _, actionId, event ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {

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

    class BeneficioAdapter(
        private val beneficios: ArrayList<Beneficio>,
        private val item: Int,
        private val attachListener: Boolean = false
    ) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view =
                convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val beneficio = beneficios[position]

            val tituloBeneficio = view.findViewById<TextView>(R.id.titulo_beneficio)
            val descricaoBeneficio = view.findViewById<TextView>(R.id.descricao_beneficio)

            tituloBeneficio.text = beneficio.titulo
            descricaoBeneficio.text = beneficio.descricao

            if (attachListener) {
                view.setOnClickListener {
                    val intent = Intent(view.context, BeneficiosEditActivity::class.java)

                    intent.putExtra("titulo", beneficio.titulo)
                    intent.putExtra("descricao", beneficio.descricao)
                    intent.putExtra("id", beneficio.id)
                    intent.putExtra("dataValidade", beneficio.dataValidade)
                    intent.putExtra("icon", beneficio.icon)

                    view.context.startActivity(intent)
                }
            }

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
