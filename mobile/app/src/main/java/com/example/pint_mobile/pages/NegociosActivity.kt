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
import com.example.pint_mobile.pages.admin.edit.BeneficiosEditActivity
import com.example.pint_mobile.pages.admin.edit.EditNegocioActivity
import com.example.pint_mobile.utils.Negocio
import com.example.pint_mobile.utils.listaNegocios
import com.example.pint_mobile.utils.setupActivityListeners

class NegociosActivity : AppCompatActivity() {
    private val negociosList = ArrayList<Negocio>()
    private val allNegociosList = ArrayList<Negocio>()
    private lateinit var negociosAdapter: NegocioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_negocios)

        setupActivityListeners(window, supportActionBar, this, "Negócios", findViewById(R.id.bottombar))

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

            tituloNegocio.text = negocio.titulo + negocio.status
            descricaoNegocio.text = negocio.descricao
            clienteNegocio.text = negocio.cliente

            if (attachListener) {
                view.setOnClickListener {
                    val intent = Intent(view.context, EditNegocioActivity::class.java)

                    intent.putExtra("titulo", negocio.titulo)
                    intent.putExtra("descricao", negocio.descricao)
                    intent.putExtra("cliente", negocio.cliente)
                    intent.putExtra("criador", negocio.criador)
                    intent.putExtra("status", negocio.status)

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
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}