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
import com.example.pint_mobile.utils.Utilizador
import com.example.pint_mobile.utils.setupActivityListeners
import com.example.pint_mobile.utils.listaUtilizadores

class AdminUtilizadoresActivity : AppCompatActivity() {
    private val utilizadoresList = ArrayList<Utilizador>()
    private val allUtilizadoresList = ArrayList<Utilizador>()
    private lateinit var utilizadoresAdapter: UtilizadorAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_utilizadores)

        setupActivityListeners(window, supportActionBar, this, "Administração de Utilizadores", findViewById(R.id.bottombar))

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
            tipoUtilizador.text = utilizador.tipoUtilizador


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

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}
