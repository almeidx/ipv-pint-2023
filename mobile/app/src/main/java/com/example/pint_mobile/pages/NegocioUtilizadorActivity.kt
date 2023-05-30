package com.example.pint_mobile.pages

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
import com.example.pint_mobile.pages.admin.edit.CriarNegocioActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Negocio
import com.example.pint_mobile.utils.NegocioUser
import com.example.pint_mobile.utils.listaNegociosUser
import com.google.android.material.bottomnavigation.BottomNavigationView

class NegocioUtilizadorActivity : ActivityBase(R.layout.activity_negocio_utilizador, "Negócios") {
    private val negociosList = ArrayList<NegocioUser>()
    private val allNegociosList = ArrayList<NegocioUser>()
    private lateinit var negociosAdapter: NegocioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaNegociosUser)
        val userId = intent.getIntExtra("userId", 0)

        negociosAdapter = NegocioAdapter(negociosList, R.layout.item_negocio)

        lista.adapter = negociosAdapter

        listaNegociosUser(negociosList, allNegociosList, negociosAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                negociosList.clear()

                for (negocio in allNegociosList) {
                    if (negocio.compareToString(search.text.toString())) {
                        negociosList.add(negocio)
                    }
                }
                negociosAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class NegocioAdapter(private val negocios: ArrayList<NegocioUser>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val negocio = negocios[position]

            val tituloNegocio  = view.findViewById<TextView>(R.id.titulo_negocio)
            val descricaoNegocio = view.findViewById<TextView>(R.id.descricao_negocio)
            val clienteNegocio = view.findViewById<TextView>(R.id.cliente_negocio)

            tituloNegocio.text = negocio.titulo
            descricaoNegocio.text = negocio.areaNegocio + ": " +  negocio.descricao
            clienteNegocio.text = negocio.cliente

            view.setOnClickListener {
                    val intent = Intent(view.context, EditNegocioUserActivity::class.java)


                    intent.putExtra("idNegocio", negocio.id)
                    intent.putExtra("titulo", negocio.titulo)
                    intent.putExtra("descricao", negocio.descricao)
                    intent.putExtra("areaNegocio", negocio.areaNegocio)
                    intent.putExtra("estadosList", negocio.estados)

                    view.context.startActivity(intent)
                }
            return view
        }
        override fun getItem(position: Int): NegocioUser {
            return negocios[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return negocios.size
        }

        private fun getStatusName(status: Int): String {
            return when (status) {
                1 -> "Em espera"
                2 -> "A validar"
                3 -> "Em desenvolvimento"
                4 -> "Em conclusão"
                5 -> "Concluído"
                else -> "Cancelado"
            }
        }
    }

    fun CriarNegocio(view: android.view.View) {
        val intent = Intent(this, CriarNegocioActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }
}