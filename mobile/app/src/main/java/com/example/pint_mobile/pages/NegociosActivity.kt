
package com.example.pint_mobile.pages
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.API
import com.example.pint_mobile.utils.Negocio

class NegociosActivity : AppCompatActivity() {

    private val negociosList = ArrayList<Negocio>()
    private val allNegociosList = ArrayList<Negocio>()
    private lateinit var negociosAdapter: NegocioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_negocios)


        supportActionBar?.title = "Negócios"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val lista = findViewById<ListView>(R.id.listaNegocios)
        negociosAdapter = NegocioAdapter(negociosList)

        lista.adapter = negociosAdapter

        API.listaNegocios(negociosList, allNegociosList, negociosAdapter, this)

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


    class NegocioAdapter(private val negocios: ArrayList<Negocio>) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(R.layout.item_negocio, parent, false)
            val negocio = negocios[position]

            val tituloNegocio  = view.findViewById<TextView>(R.id.titulo_negocio)
            val descricaoNegocio = view.findViewById<TextView>(R.id.descricao_negocio)
            val clienteNegocio = view.findViewById<TextView>(R.id.cliente_negocio)


            tituloNegocio.text = negocio.titulo
            descricaoNegocio.text = negocio.descricao
            clienteNegocio.text = negocio.cliente


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