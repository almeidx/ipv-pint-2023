package com.example.pint_mobile.pages

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Notificacao
import com.example.pint_mobile.utils.formatDate
import com.example.pint_mobile.utils.listaNotificacoes
import com.example.pint_mobile.utils.marcarTodasNotiLidas
import com.google.android.material.bottomnavigation.BottomNavigationView


class NotificacoesActivity : ActivityBase(R.layout.activity_notificacoes, "Notificações") {
    private val notificacoesList = ArrayList<Notificacao>()
    private lateinit var notificacaoAdapter: NotificacaoAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.lista_notificacoes)
        notificacaoAdapter =
            NotificacaoAdapter(notificacoesList, R.layout.item_notificacao)

        lista.adapter = notificacaoAdapter

        listaNotificacoes(notificacoesList, notificacaoAdapter, this)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.inicio).isEnabled = true
        nav.menu.findItem(R.id.notificacoes).isEnabled = false
        nav.menu.findItem(R.id.notificacoes).isChecked = true
    }

    class NotificacaoAdapter(
        private val notificacoes: ArrayList<Notificacao>,
        private val item: Int
    ) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view =
                convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
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

    fun marcarTodasComoLida(view: View) {
        marcarTodasNotiLidas(this)
        notificacaoAdapter.notifyDataSetChanged()
    }
}
