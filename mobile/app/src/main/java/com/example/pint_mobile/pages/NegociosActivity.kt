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
import com.example.pint_mobile.pages.admin.edit.EditNegocioActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Negocio
import com.example.pint_mobile.utils.listaNegocios

class NegociosActivity : ActivityBase(R.layout.activity_negocios, "Negócios") {
    private val negociosList = ArrayList<Negocio>()
    private val allNegociosList = ArrayList<Negocio>()
    private lateinit var negociosAdapter: NegocioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaNegocios)
        negociosAdapter = NegocioAdapter(negociosList, R.layout.item_negocio, false)

        lista.adapter = negociosAdapter

        listaNegocios(negociosList, allNegociosList, negociosAdapter, this)

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
    }

    class NegocioAdapter(private val negocios: ArrayList<Negocio>, private val item: Int, private val attachListener: Boolean = false) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val negocio = negocios[position]

            val tituloNegocio  = view.findViewById<TextView>(R.id.titulo_negocio)
            val descricaoNegocio = view.findViewById<TextView>(R.id.descricao_negocio)
            val clienteNegocio = view.findViewById<TextView>(R.id.cliente_negocio)

            tituloNegocio.text = negocio.titulo
            descricaoNegocio.text = negocio.descricao
            clienteNegocio.text = negocio.cliente

            if (attachListener) {
                view.setOnClickListener {
                    val intent = Intent(view.context, EditNegocioActivity::class.java)

                    intent.putExtra("id", negocio.id)
                    intent.putExtra("Cliente", negocio.cliente)
                    intent.putExtra("FuncionarioName", negocio.FuncionarioName)
                    intent.putExtra("FuncionarioEmail", negocio.FuncionarioEmail)
                    intent.putExtra("centroTrabalhoName", negocio.centroTrabalhoName)
                    intent.putExtra("centroTrabalhoLocation", negocio.centroTrabalhoLocation)
                    intent.putExtra("centroTrabalhoPostalCode", negocio.centroTrabalhoPostalCode)
                    intent.putExtra("centroTrabalhoAdress", negocio.centroTrabalhoAdress)
                    intent.putExtra("titulo", negocio.titulo)
                    intent.putExtra("estado", negocio.estado)
                    intent.putExtra("data", negocio.dataFinalizacao)

                    view.context.startActivity(intent)
                }
            } else {
                view.setOnClickListener {
                    val intent = Intent(view.context, InfoNegocioActivity::class.java)

                    intent.putExtra("titulo", negocio.titulo)
                    intent.putExtra("descricao", negocio.descricao)
                    intent.putExtra("cliente", negocio.cliente)
                    intent.putExtra("criador", negocio.criador)
                    intent.putExtra("criadorEmail", negocio.criadorEmail)
                    intent.putExtra("areaNegocio", negocio.areaNegocio)
                    intent.putExtra("FuncName", negocio.FuncionarioName)
                    intent.putExtra("FuncEmail", negocio.FuncionarioEmail)
                    intent.putExtra("centroTrabalhoName", negocio.centroTrabalhoName)
                    intent.putExtra("centroTrabalhoLocation", negocio.centroTrabalhoLocation)
                    intent.putExtra("centroTrabalhoPostalCode", negocio.centroTrabalhoPostalCode)
                    intent.putExtra("centroTrabalhoAdress", negocio.centroTrabalhoAdress)

                    view.context.startActivity(intent)
                }
            }



            return view
        }
        override fun getItem(position: Int): Negocio {
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
}
