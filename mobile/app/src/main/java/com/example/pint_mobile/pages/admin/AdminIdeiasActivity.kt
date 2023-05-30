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
import com.example.pint_mobile.pages.IdeiasActivity
import com.example.pint_mobile.pages.admin.edit.ValidarIdeiaActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Ideia
import com.example.pint_mobile.utils.listaIdeias
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminIdeiasActivity : ActivityBase(R.layout.activity_admin_ideias, "Administração de Ideias") {
    private val ideiasList = ArrayList<Ideia>()
    private val allIdeiasList = ArrayList<Ideia>()
    private lateinit var ideiasAdapter: IdeiaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaIdeias)
        ideiasAdapter = IdeiaAdapter(ideiasList, R.layout.item_ideia_admin)

        lista.adapter = ideiasAdapter

        listaIdeias(ideiasList, allIdeiasList, ideiasAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                ideiasList.clear()

                for (negocio in allIdeiasList) {
                    if (negocio.compareToString(search.text.toString())) {
                        ideiasList.add(negocio)
                    }
                }
                ideiasAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class IdeiaAdapter(private val ideias: ArrayList<Ideia>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val ideia = ideias[position]

            val nomeIdeia  = view.findViewById<TextView>(R.id.titulo_ideia)
            val categoriaIdeia = view.findViewById<TextView>(R.id.categoria)
            val criadorIdeia = view.findViewById<TextView>(R.id.criador)
            val dataIdeia = view.findViewById<TextView>(R.id.data_criacao)

            nomeIdeia.text = ideia.descricao
            categoriaIdeia.text = ideia.categoria
            criadorIdeia.text = ideia.dataCriacao
            dataIdeia.text = ideia.criador

            view.setOnClickListener {
                val intent = Intent(view.context, ValidarIdeiaActivity::class.java)

                intent.putExtra("titulo", ideia.descricao)
                intent.putExtra("descricao", ideia.categoria)
                intent.putExtra("data", ideia.dataCriacao)
                intent.putExtra("criador", ideia.criador)
                intent.putExtra("id", ideia.id)
                intent.putExtra("validacao", ideia.validada)

                view.context.startActivity(intent)
            }

            return view
        }

        override fun getItem(position: Int): Ideia {
            return ideias[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return ideias.size
        }
    }

    fun CriarIdeia(view: View) {
        val intent = Intent(this, IdeiasActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }
}
