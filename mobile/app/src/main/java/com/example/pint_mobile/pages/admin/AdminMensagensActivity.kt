package com.example.pint_mobile.pages.admin

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
import com.example.pint_mobile.pages.ContactoActivity
import com.example.pint_mobile.pages.admin.edit.MensagemValidarActivity
import com.example.pint_mobile.utils.Mensagem
import com.example.pint_mobile.utils.listaMensagens
import com.example.pint_mobile.utils.setupActivityListeners

class AdminMensagensActivity : AppCompatActivity() {

    private val mensagensList = ArrayList<Mensagem>()
    private val allMensagensList = ArrayList<Mensagem>()
    private lateinit var mensagensAdapter: MensagemAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_mensagens)

        setupActivityListeners(window, supportActionBar, this, "Administração de Mensagens", findViewById(R.id.bottombar))
        val lista = findViewById<ListView>(R.id.listaMensagens)
        mensagensAdapter = MensagemAdapter(mensagensList, R.layout.item_mensagem_admin)

        lista.adapter = mensagensAdapter

        listaMensagens(mensagensList, allMensagensList, mensagensAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                mensagensList.clear()

                for (mensagem in allMensagensList) {
                    if (mensagem.compareToString(search.text.toString())) {
                        mensagensList.add(mensagem)
                    }
                }
                mensagensAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }

    }

    class MensagemAdapter(private val mensagens: ArrayList<Mensagem>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val mensagem = mensagens[position]

            val nomeMensagem = view.findViewById<TextView>(R.id.nome_mensagem)
            val infoMensagem  = view.findViewById<TextView>(R.id.info_mensagem)
            val conteudoMensagem  = view.findViewById<TextView>(R.id.conteudo_mensagem)


            nomeMensagem.text = mensagem.nome
            conteudoMensagem.text = mensagem.conteudo
            infoMensagem.text = "${if(mensagem.registado) "Utilizador Registado -" else "Utilizador Não Registado -"}   ${mensagem.data} "

            view.setOnClickListener {
                val intent = Intent(view.context, MensagemValidarActivity::class.java)

                intent.putExtra("titulo", mensagem.nome)
                intent.putExtra("descricao", mensagem.conteudo)
                intent.putExtra("data", mensagem.data)
                intent.putExtra("registo", mensagem.registado)

                view.context.startActivity(intent)
            }

            return view
        }
        override fun getItem(position: Int): Mensagem {
            return mensagens[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return mensagens.size
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun CriarNovaMensagem(view: View) {
        val intent = android.content.Intent(this, ContactoActivity::class.java)
        startActivity(intent)
    }
}