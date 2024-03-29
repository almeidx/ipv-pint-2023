package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.BaseAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.edit.VagasEditActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Vaga
import com.example.pint_mobile.utils.listaVagas
import com.google.android.material.bottomnavigation.BottomNavigationView

class VagasActivity : ActivityBase(R.layout.activity_vagas, "Vagas") {
    private val vagasList = ArrayList<Vaga>()
    private val allVagasList = ArrayList<Vaga>()
    private lateinit var vagasAdapter: VagaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaVagas)
        vagasAdapter = VagaAdapter(vagasList, R.layout.item_vaga)

        lista.adapter = vagasAdapter

        listaVagas(vagasList, allVagasList, vagasAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnEditorActionListener { _, actionId, event ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {

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
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class VagaAdapter(
        private val vagas: ArrayList<Vaga>,
        private val item: Int,
        private val attachListener: Boolean = false
    ) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view =
                convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val vaga = vagas[position]

            val tituloVaga = view.findViewById<TextView>(R.id.titulo_vaga)
            val informacoesVaga = view.findViewById<TextView>(R.id.informacoes_vaga)

            val publicText = if (!vaga.publico) "Colaboradores" else ""

            tituloVaga.text = vaga.titulo
            informacoesVaga.text = "$publicText | Vagas: ${vaga.slots}"

            if (attachListener) {
                view.setOnClickListener {
                    val intent = Intent(view.context, VagasEditActivity::class.java)

                    intent.putExtra("titulo", vaga.titulo)
                    intent.putExtra("descricao", vaga.descricao)
                    intent.putExtra("publico", publicText)
                    intent.putExtra("slots", vaga.slots.toString())
                    intent.putExtra("id", vaga.id)
                    intent.putExtra("status", vaga.status)

                    view.context.startActivity(intent)
                }
            } else {
                view.setOnClickListener {
                    val intent = Intent(view.context, InfoVagaActivity::class.java)

                    intent.putExtra("titulo", vaga.titulo)
                    intent.putExtra("descricao", vaga.descricao)
                    intent.putExtra("publico", publicText)
                    intent.putExtra("slots", vaga.slots.toString())
                    intent.putExtra("status", vaga.status)
                    intent.putExtra("id", vaga.id)

                    view.context.startActivity(intent)
                }
            }
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

    fun goToVagasCandidatadas(view: View) {
        val intent = Intent(this, VagasCandidatadasActivity::class.java)
        startActivity(intent)
    }
}
