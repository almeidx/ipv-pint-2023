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
import com.example.pint_mobile.pages.admin.edit.EditarUtilizadorActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Utilizador
import com.example.pint_mobile.utils.listaUtilizadores

class AdminUtilizadoresActivity : ActivityBase(R.layout.activity_admin_utilizadores, "Administração de Utilizadores") {
    private val utilizadoresList = ArrayList<Utilizador>()
    private val allUtilizadoresList = ArrayList<Utilizador>()
    private lateinit var utilizadoresAdapter: UtilizadorAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaUtilizador)
        utilizadoresAdapter = UtilizadorAdapter(utilizadoresList, R.layout.item_utilizadores)

        lista.adapter = utilizadoresAdapter

        listaUtilizadores(utilizadoresList, allUtilizadoresList, utilizadoresAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                utilizadoresList.clear()

                for (negocio in allUtilizadoresList) {
                    if (negocio.compareToString(search.text.toString())) {
                        utilizadoresList.add(negocio)
                    }
                }
                utilizadoresAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }
    }

    class UtilizadorAdapter(private val utilizadores: ArrayList<Utilizador>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val utilizador = utilizadores[position]

            val nomeUtilizador  = view.findViewById<TextView>(R.id.nome_utilizador)
            val emailUtilizador = view.findViewById<TextView>(R.id.email_utilizador)
            val tipoUtilizador = view.findViewById<TextView>(R.id.tipoUtilizador)

            nomeUtilizador.text = utilizador.nome
            emailUtilizador.text = utilizador.email
            tipoUtilizador.text = utilizador.tipoUser.nome

            view.setOnClickListener {
                val intent = Intent(view.context, EditarUtilizadorActivity::class.java)

                intent.putExtra("nome", utilizador.nome)
                intent.putExtra("email", utilizador.email)
                intent.putExtra("cargoId", utilizador.tipoUser.id)


                view.context.startActivity(intent)
            }


            return view
        }

        override fun getItem(position: Int): Utilizador {
            return utilizadores[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return utilizadores.size
        }
    }
}
