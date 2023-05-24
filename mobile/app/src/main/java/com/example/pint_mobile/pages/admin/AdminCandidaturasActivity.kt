package com.example.pint_mobile.pages.admin

import android.os.Bundle
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Candidatura
import com.example.pint_mobile.utils.listaCandidaturas
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminCandidaturasActivity : ActivityBase(R.layout.activity_admin_candidaturas, "Administração de Candidaturas") {
    private val candidaturasList = ArrayList<Candidatura>()
    private val allCandidaturasList = ArrayList<Candidatura>()
    private lateinit var candidaturasAdapter: CandidaturaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaCandidaturas)
        candidaturasAdapter = CandidaturaAdapter(candidaturasList, R.layout.item_candidatura_admin)

        lista.adapter = candidaturasAdapter

        listaCandidaturas(candidaturasList, allCandidaturasList, candidaturasAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                candidaturasList.clear()

                for (candidatura in allCandidaturasList) {
                    if (candidatura.compareToString(search.text.toString())) {
                        candidaturasList.add(candidatura)
                    }
                }

                candidaturasAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class CandidaturaAdapter(private val candidaturas: ArrayList<Candidatura>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val candidatura = candidaturas[position]

            val nomeCandidatura = view.findViewById<TextView>(R.id.nome_candidatura)
            val infoCandidatura = view.findViewById<TextView>(R.id.informacoes_candidatura)
            val dataCandidatura = view.findViewById<TextView>(R.id.data_candidatura)

            nomeCandidatura.text = candidatura.nome
            infoCandidatura.text = candidatura.titulo +  " - " + candidatura.descricao
            dataCandidatura.text = candidatura.data

            return view
        }

        override fun getItem(position: Int): Candidatura {
            return candidaturas[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return candidaturas.size
        }
    }
}
