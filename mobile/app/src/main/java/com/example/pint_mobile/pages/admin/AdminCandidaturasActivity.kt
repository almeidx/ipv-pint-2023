package com.example.pint_mobile.pages.admin

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
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
import com.example.pint_mobile.pages.IdeiasActivity
import com.example.pint_mobile.pages.VagasActivity
import com.example.pint_mobile.utils.Candidatura
import com.example.pint_mobile.utils.Utilizador
import com.example.pint_mobile.utils.Vaga
import com.example.pint_mobile.utils.listaCandidaturas
import com.example.pint_mobile.utils.listaVagas
import com.example.pint_mobile.utils.setupActivityListeners

class AdminCandidaturasActivity : AppCompatActivity() {

    private val candidaturasList = ArrayList<Candidatura>()
    private val allCandidaturasList = ArrayList<Candidatura>()
    private lateinit var candidaturasAdapter: CandidaturaAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_candidaturas)

        setupActivityListeners(window, supportActionBar, this, "Administração Candidaturas", findViewById(R.id.bottombar))
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

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }


}