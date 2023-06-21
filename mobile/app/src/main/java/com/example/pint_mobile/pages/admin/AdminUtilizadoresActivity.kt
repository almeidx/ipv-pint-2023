package com.example.pint_mobile.pages.admin

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.BaseAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.edit.CriarReuniaoActivity
import com.example.pint_mobile.pages.admin.edit.EditarUtilizadorActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Utilizador
import com.example.pint_mobile.utils.listaUtilizadores
import com.google.android.material.bottomnavigation.BottomNavigationView

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
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class UtilizadorAdapter(private val utilizadores: ArrayList<Utilizador>, private val item: Int, private val fromReuniao: Boolean = false, private val users: ArrayList<String> = ArrayList(), private val userIds: ArrayList<Int> = ArrayList(), private val negocioId: ArrayList<Int> = ArrayList(), private val candidaturaId: ArrayList<Int> = ArrayList(), private val data: ArrayList<String> = ArrayList()) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val utilizador = utilizadores[position]

            val nomeUtilizador  = view.findViewById<TextView>(R.id.nome_utilizador)
            val emailUtilizador = view.findViewById<TextView>(R.id.email_utilizador)
            val tipoUtilizador = view.findViewById<TextView>(R.id.tipoUtilizador)

            nomeUtilizador.text = utilizador.nome
            emailUtilizador.text = utilizador.email
            tipoUtilizador.text = utilizador.tipoUser.nome

            Log.i("negocioId", negocioId.toString())

            if(fromReuniao) {
                view.setOnClickListener {
                    val intent = Intent(view.context, CriarReuniaoActivity::class.java)

                    users.add(utilizador.nome)
                    userIds.add(utilizador.id)

                    intent.putExtra("users",  users)
                    intent.putExtra("userIds", userIds)
                    intent.putExtra("negocioId", negocioId)
                    intent.putExtra("candidaturaId", candidaturaId)
                    intent.putExtra("data", data)

                    view.context.startActivity(intent)
                }
            }else {

                view.setOnClickListener {
                    val intent = Intent(view.context, EditarUtilizadorActivity::class.java)

                    intent.putExtra("id", utilizador.id)
                    intent.putExtra("nome", utilizador.nome)
                    intent.putExtra("email", utilizador.email)
                    intent.putExtra("cargoId", utilizador.tipoUser.Id)
                    intent.putExtra("disable", utilizador.disable)

                    view.context.startActivity(intent)
                }
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
