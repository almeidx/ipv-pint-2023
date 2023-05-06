package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.Notificacao
import com.example.pint_mobile.utils.formatDate
import com.example.pint_mobile.utils.listaNotificacoes
import com.example.pint_mobile.utils.setupActivityListeners

class NotificacoesActivity : AppCompatActivity() {
    private val notificacoesList = ArrayList<Notificacao>()
    private lateinit var notificacaoAdapter: NotificacaoAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notificacoes)

        setupActivityListeners(window, supportActionBar, this, "Notificações", findViewById(R.id.bottombar))

        val lista = findViewById<ListView>(R.id.lista_notificacoes)
        notificacaoAdapter =
            NotificacaoAdapter(notificacoesList, R.layout.item_notificacao)

        lista.adapter = notificacaoAdapter

        listaNotificacoes(notificacoesList, notificacaoAdapter, this)
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    class NotificacaoAdapter(private val notificacoes: ArrayList<Notificacao>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val notificacao = notificacoes[position]

            val tituloNotificacao = view.findViewById<TextView>(R.id.titulo_notificacao)
            val descricaoNotificacao = view.findViewById<TextView>(R.id.descricao_notificacao)
            val dataNotificacao = view.findViewById<TextView>(R.id.data_notificacao)

            tituloNotificacao.text = getTitle(notificacao.type)
            descricaoNotificacao.text = notificacao.content
            dataNotificacao.text = formatDate(notificacao.createdAt)

            return view
        }

        override fun getItem(position: Int): Notificacao {
            return notificacoes[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return notificacoes.size
        }

        private fun getTitle(type: Int): String {
            return when (type) {
                1 -> "Novo benefício"
                2 -> "Novo negócio"
                3 -> "Nova vaga"
                4 -> "Nova reunião"
                else -> "Novo evento"
            }
        }
    }
}
