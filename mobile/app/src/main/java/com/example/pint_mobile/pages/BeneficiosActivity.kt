package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.edit.BeneficiosEditActivity
import com.example.pint_mobile.utils.Beneficio
import com.example.pint_mobile.utils.listaBeneficios
import com.example.pint_mobile.utils.setupActivityListeners

class BeneficiosActivity : AppCompatActivity() {
    private val beneficiosList = ArrayList<Beneficio>()
    private val allBeneficiosList = ArrayList<Beneficio>()
    private lateinit var beneficiosAdapter: BeneficioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_beneficios)

        setupActivityListeners(window, supportActionBar, this, "Benefícios", findViewById(R.id.bottombar))

        val lista = findViewById<ListView>(R.id.listaBeneficios)
        beneficiosAdapter = BeneficioAdapter(beneficiosList, R.layout.item_beneficio)

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

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    class BeneficioAdapter(private val beneficios: ArrayList<Beneficio>, private val item: Int, private val attachListener: Boolean = false) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
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
