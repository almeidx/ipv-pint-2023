package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.API
import com.example.pint_mobile.utils.Vaga

class VagasActivity : AppCompatActivity() {
    private val vagasList = ArrayList<Vaga>()
    private val allVagasList = ArrayList<Vaga>()
    private lateinit var vagasAdapter: VagaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_vagas)

        supportActionBar?.title = "Vagas"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val lista = findViewById<ListView>(R.id.listaVagas)
        vagasAdapter = VagaAdapter(vagasList)

        lista.adapter = vagasAdapter

        API.listaVagas(vagasList, allVagasList, vagasAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                vagasList.clear()

                for (vaga in allVagasList) {
                    if (vaga.compareToString(search.text.toString())) {
                        vagasList.add(vaga)
                    }
                }

                vagasAdapter.notifyDataSetChanged()

                true
            } else {
                false
            }
        }

    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    class VagaAdapter(private val vagas: ArrayList<Vaga>) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(R.layout.item_vaga, parent, false)
            val vaga = vagas[position]

            val tituloVaga  = view.findViewById<TextView>(R.id.titulo_vaga)
            val descricaoVaga = view.findViewById<TextView>(R.id.descricao_vaga)
            val inforcoesVaga = view.findViewById<TextView>(R.id.informacoes_vaga)

            tituloVaga.text = vaga.titulo
            descricaoVaga.text = vaga.descricao
            inforcoesVaga.text = "${if(vaga.publico) "Aberta" else "Colaboradores"} | Vagas: ${vaga.slots}"

            return view
        }

        override fun getItem(position: Int): Vaga {
            return vagas[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return vagas.size
        }
    }
}