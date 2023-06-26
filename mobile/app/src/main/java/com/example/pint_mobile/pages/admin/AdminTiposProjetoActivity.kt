package com.example.pint_mobile.pages.admin

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.edit.CriarTiposProjetoActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.TipoProjeto
import com.example.pint_mobile.utils.deleteTipoProjeto
import com.example.pint_mobile.utils.listaTipoProjeto
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminTiposProjetoActivity :
    ActivityBase(R.layout.activity_admin_tipos_projeto, "Administração Tipos de Projeto") {

    private val projetosList = ArrayList<TipoProjeto>()
    private val allProjetosList = ArrayList<TipoProjeto>()
    private lateinit var projetosAdapter: ProjetosAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaProjetos)
        projetosAdapter = ProjetosAdapter(projetosList, R.layout.item_tipo_projeto)

        lista.adapter = projetosAdapter

        listaTipoProjeto(projetosList, allProjetosList, projetosAdapter, this)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class ProjetosAdapter(private val projetos: ArrayList<TipoProjeto>, private val item: Int) :
        BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view =
                convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val projeto = projetos[position]

            val tituloVaga = view.findViewById<TextView>(R.id.titulo_projeto)
            val informacoesVaga = view.findViewById<TextView>(R.id.id_projeto)

            tituloVaga.text = projeto.nome
            informacoesVaga.text = projeto.id.toString()

            view.setOnClickListener {
                deleteTipoProjeto(projeto.id, view.context)
            }

            return view
        }

        override fun getItem(position: Int): TipoProjeto {
            return projetos[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return projetos.size
        }
    }

    fun CriarTiposProjeto(view: View) {
        val intent = Intent(this, CriarTiposProjetoActivity::class.java)
        startActivity(intent)
    }
}