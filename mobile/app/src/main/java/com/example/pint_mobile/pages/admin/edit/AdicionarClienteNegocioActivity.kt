package com.example.pint_mobile.pages.admin.edit

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.BaseAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.AdminIdeiasActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Cliente
import com.example.pint_mobile.utils.Ideia
import com.example.pint_mobile.utils.listaClientes
import com.example.pint_mobile.utils.listaIdeias
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdicionarClienteNegocioActivity : ActivityBase(R.layout.activity_adicionar_cliente_negocio, "Adicionar Cliente") {
    private val clientesList = ArrayList<Cliente>()
    private val allClientesList = ArrayList<Cliente>()
    private lateinit var clientesAdapter: ClienteAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaClientes)
        clientesAdapter = ClienteAdapter(
            clientesList,
            R.layout.item_cliente_negocio,
            intent.getStringArrayListExtra("clienteNome")!!,
            intent.getIntegerArrayListExtra("clienteIds")!!,
        )

        lista.adapter = clientesAdapter

        listaClientes(clientesList, allClientesList, clientesAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnEditorActionListener { _, actionId, event ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {

                clientesList.clear()

                for (cliente in allClientesList) {
                    if (cliente.compareToString(search.text.toString())) {
                        clientesList.add(cliente)
                    }
                }

                clientesAdapter.notifyDataSetChanged()

                true
            } else {
                false
            }
        }

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class ClienteAdapter(private val clientes: ArrayList<Cliente>, private val item: Int, private val clienteNome: ArrayList<String> = ArrayList(), private val clienteIds: ArrayList<Int> = ArrayList()) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val cliente = clientes[position]

            val nomeCliente  = view.findViewById<TextView>(R.id.NomeCliente)
            val idCliente = view.findViewById<TextView>(R.id.idCliente)

            nomeCliente.text = cliente.nome
            idCliente.text = cliente.clienteId.toString()

            Log.i("cliente", clienteNome.toString())
            Log.i("clienteId", clienteIds.toString())

            Log.i("cliente", cliente.nome)
            Log.i("clienteId", cliente.clienteId.toString())

            view.setOnClickListener {
                val intent = Intent(view.context, CriarNegocioActivity::class.java)

                clienteNome.clear()
                clienteIds.clear()

                clienteNome.add(cliente.nome)
                clienteIds.add(cliente.clienteId)

                intent.putExtra("clienteNome", clienteNome)
                intent.putExtra("clienteIds", clienteIds)

                view.context.startActivity(intent)
            }

            return view
        }

        override fun getItem(position: Int): Cliente {
            return clientes[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return clientes.size
        }
    }

    fun adicionarNovoCliente(view: View) {
        val intent = Intent(this, CriarClienteActivity::class.java)

        intent.putExtra("clienteNome", intent.getStringArrayListExtra("clienteNome"))
        intent.putExtra("clienteIds", intent.getIntegerArrayListExtra("clienteIds"))

        startActivity(intent)
        overridePendingTransition(0, 0);
    }

}