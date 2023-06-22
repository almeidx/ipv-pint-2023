package com.example.pint_mobile.pages

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
import com.example.pint_mobile.pages.admin.edit.VagasEditActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Vaga
import com.example.pint_mobile.utils.formatDateComHoras
import com.example.pint_mobile.utils.listaVagas
import com.example.pint_mobile.utils.listarVagasUser
import com.example.pint_mobile.utils.vagaCandidatada
import com.google.android.material.bottomnavigation.BottomNavigationView

class VagasCandidatadasActivity :  ActivityBase(R.layout.activity_vagas_candidatadas, "Vagas Candidatadas") {

    private val vagasCandidatadasList = ArrayList<vagaCandidatada>()
    private val allVagasCandidatadasList = ArrayList<vagaCandidatada>()
    private lateinit var vagasCandidatadasAdapter: VagaCandidatadaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaVagasCandidatadas)
        vagasCandidatadasAdapter = VagaCandidatadaAdapter(vagasCandidatadasList, R.layout.item_vaga_candidatada)

        lista.adapter = vagasCandidatadasAdapter

        listarVagasUser(vagasCandidatadasList, allVagasCandidatadasList, vagasCandidatadasAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                vagasCandidatadasList.clear()

                for (vaga in allVagasCandidatadasList) {
                    if (vaga.compareToString(search.text.toString())) {
                        vagasCandidatadasList.add(vaga)
                    }
                }

                vagasCandidatadasAdapter.notifyDataSetChanged()

                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class VagaCandidatadaAdapter(private val vagas: ArrayList<vagaCandidatada>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val vaga = vagas[position]

            val tituloVaga  = view.findViewById<TextView>(R.id.titulo_vaga)
            val descricao = view.findViewById<TextView>(R.id.descricaoVagaCandidatada)

            var submissao = view.findViewById<TextView>(R.id.submissaoVagaCandidatada)
            submissao.text = "Submetida a:" + formatDateComHoras(vaga.submissionDate)

            tituloVaga.text = vaga.titulo
            descricao.text = vaga.descricao

            return view
        }

        override fun getItem(position: Int): vagaCandidatada {
            return vagas[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return vagas.size
        }
    }

}