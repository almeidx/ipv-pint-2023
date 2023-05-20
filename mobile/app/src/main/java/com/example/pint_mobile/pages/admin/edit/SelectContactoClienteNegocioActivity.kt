package com.example.pint_mobile.pages.admin.edit

import android.content.Intent
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
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Contacto
import com.example.pint_mobile.utils.listaContactosCliente

class SelectContactoClienteNegocioActivity : ActivityBase(R.layout.activity_select_contacto_cliente_negocio, "Selecionar Contacto") {

    private val contactosList = ArrayList<Contacto>()
    private val allContactosList = ArrayList<Contacto>()
    private lateinit var contactosAdapter: ContactosAdapter
    private lateinit var clienteIds: ArrayList<Int>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaContactosCliente22)
        contactosAdapter = ContactosAdapter(
            contactosList,
            R.layout.item_contacto_cliente,
        )

        clienteIds = intent.getIntegerArrayListExtra("clienteIds") ?: ArrayList()
        Log.i("clienteIds", clienteIds.toString())

        val idCliente = clienteIds[0]

        lista.adapter = contactosAdapter

        listaContactosCliente(contactosList, allContactosList, contactosAdapter,this, idCliente)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnKeyListener { _, keyCode, event ->
            if ((event.action == KeyEvent.ACTION_DOWN) &&
                (keyCode == KeyEvent.KEYCODE_ENTER)) {

                contactosList.clear()

                for (negocio in allContactosList) {
                    if (negocio.compareToString(search.text.toString())) {
                        contactosList.add(negocio)
                    }
                }
                contactosAdapter.notifyDataSetChanged()
                true
            } else {
                false
            }
        }
    }

    class ContactosAdapter(private val contactos: ArrayList<Contacto>, private val item: Int) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val contacto = contactos[position]

            val idClienteContacto = view.findViewById<TextView>(R.id.idCliente)
            val valueContacto = view.findViewById<TextView>(R.id.valueContacto)

            idClienteContacto.text = contacto.idCliente.toString()
            valueContacto.text = contacto.value

            view.setOnClickListener {
                val intent = Intent(view.context, CriarNegocioActivity::class.java)

                view.context.startActivity(intent)
            }

            return view
        }

        override fun getItem(position: Int): Contacto {
            return contactos[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return contactos.size
        }
    }

}