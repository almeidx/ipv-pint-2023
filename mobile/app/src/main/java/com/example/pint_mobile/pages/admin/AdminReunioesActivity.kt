package com.example.pint_mobile.pages.admin

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
import com.example.pint_mobile.utils.Mensagem
import com.example.pint_mobile.utils.Reuniao
import com.example.pint_mobile.utils.listaMensagens
import com.example.pint_mobile.utils.listaReunioes
import com.example.pint_mobile.utils.setupActivityListeners

class AdminReunioesActivity : AppCompatActivity() {

    private val reunioesList = ArrayList<Reuniao>()
    private val allReunioesList = ArrayList<Reuniao>()
    private lateinit var reunioesAdapter: ReuniaoAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_reunioes)

        setupActivityListeners(window, supportActionBar, this, "Administração de Reuniões", findViewById(R.id.bottombar))
        val lista = findViewById<ListView>(R.id.listaReunioes)
        reunioesAdapter = ReuniaoAdapter(reunioesList, R.layout.item_reuniao_admin)

        lista.adapter = reunioesAdapter

        listaReunioes(reunioesList, allReunioesList, reunioesAdapter, this)

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

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}