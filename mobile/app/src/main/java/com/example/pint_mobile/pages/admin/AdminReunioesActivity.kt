package com.example.pint_mobile.pages.admin

import android.content.Intent
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
import com.example.pint_mobile.pages.admin.edit.CriarReuniaoActivity
import com.example.pint_mobile.pages.admin.edit.EditarReuniaoActivity
import com.example.pint_mobile.pages.admin.edit.EditarUtilizadorActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Reuniao
import com.example.pint_mobile.utils.listaReunioes
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminReunioesActivity : ActivityBase(R.layout.activity_admin_reunioes, "Administração de Reuniões") {
    private val reunioesList = ArrayList<Reuniao>()
    private val allReunioesList = ArrayList<Reuniao>()
    private lateinit var reunioesAdapter: ReuniaoAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaReunioes)
        reunioesAdapter = ReuniaoAdapter(reunioesList, R.layout.item_reuniao_admin)

        lista.adapter = reunioesAdapter

        listaReunioes(reunioesList, allReunioesList, reunioesAdapter, this, true)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                reunioesList.clear()

                for (mensagem in allReunioesList) {
                    if (mensagem.compareToString(search.text.toString())) {
                        reunioesList.add(mensagem)
                    }
                }
                reunioesAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class ReuniaoAdapter(private val reunioes: ArrayList<Reuniao>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val reuniao = reunioes[position]

            val nomeReuniao = view.findViewById<TextView>(R.id.title_reuniao)
            val conteudoReuniao = view.findViewById<TextView>(R.id.conteudo_reuniao)
            val infoReuniao  = view.findViewById<TextView>(R.id.info_reuniao)

            nomeReuniao.text = reuniao.title
            conteudoReuniao.text = reuniao.description
            infoReuniao.text = reuniao.date + " - " + reuniao.duration + ":minutos"

            view.setOnClickListener {
                    val intent = Intent(view.context, EditarReuniaoActivity::class.java)

                intent.putExtra("dataReuniao", reuniao.date)
                intent.putExtra("idReuniao", reuniao.id)
                intent.putExtra("negocioReuniao", reuniao.negocio)
                intent.putExtra("descricaoReuniao", reuniao.description)
                intent.putExtra("nomeReuniao", reuniao.title)
                intent.putExtra("candidaturaReuniao", reuniao.candidatura)
                intent.putExtra("subjectReuniao", reuniao.subject)
                intent.putExtra("duracaoReuniao", reuniao.duration)

                view.context.startActivity(intent)
            }
            return view
        }

        override fun getItem(position: Int): Reuniao {
            return reunioes[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return reunioes.size
        }
    }
}
