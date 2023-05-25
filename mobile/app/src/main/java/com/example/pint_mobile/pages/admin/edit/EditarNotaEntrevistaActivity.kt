package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Negocio
import com.example.pint_mobile.utils.NotaReuniao
import com.example.pint_mobile.utils.createNotaReuniao
import com.example.pint_mobile.utils.listarNotasReuniao
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.textfield.TextInputEditText

class EditarNotaEntrevistaActivity : ActivityBase(R.layout.activity_editar_nota_entrevista, "Notas Entrevista") {

    private val notasEntrevistaList = ArrayList<NotaReuniao>()
    private val allNotasEntrevistaList = ArrayList<NotaReuniao>()
    private lateinit var notasEntrevistaAdapter: NotaReuniaoAdapter

    private var id = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nome = intent.getStringExtra("Nome")
        val titulo = intent.getStringExtra("Titulo")
        id = intent.getIntExtra("Id", -1)

        val nomeCandidato = findViewById<TextView>(R.id.tituloCandidaturaEdit)
        nomeCandidato.setText(nome + " - " + titulo)

        val lista = findViewById<android.widget.ListView>(R.id.listaNotasEntrevista)

        notasEntrevistaAdapter = NotaReuniaoAdapter(notasEntrevistaList, R.layout.item_nota_reuniao)

        lista.adapter = notasEntrevistaAdapter

        listarNotasReuniao(notasEntrevistaList, allNotasEntrevistaList, notasEntrevistaAdapter,id, this)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class NotaReuniaoAdapter(private val notas: ArrayList<NotaReuniao>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view =
                convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val nota = notas[position]

            val content = view.findViewById<TextView>(R.id.descricao_nota_reuniao)
            val info = view.findViewById<TextView>(R.id.info_nota_reuniao)

            content.text = nota.content
            info.text = nota.id.toString() + " - " + nota.data

            return view
        }

        override fun getItem(position: Int): NotaReuniao {
            return notas[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return notas.size
        }
    }

    fun criarNota(view: View) {
        val nota = findViewById<TextInputEditText>(R.id.nota).text.toString()

        createNotaReuniao(id, nota,this)
    }
}