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
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Contacto
import com.example.pint_mobile.utils.listaContactosCliente
import com.google.android.material.bottomnavigation.BottomNavigationView
import kotlin.properties.Delegates

class SelectContactoClienteNegocioActivity : ActivityBase(R.layout.activity_select_contacto_cliente_negocio, "Selecionar Contacto") {

    private val contactosList = ArrayList<Contacto>()
    private val allContactosList = ArrayList<Contacto>()
    private lateinit var contactosAdapter: ContactosAdapter
    private lateinit var clientNames: ArrayList<String>
    private lateinit var clienteIds: ArrayList<Int>
    private lateinit var contactoIds: ArrayList<Int>
    private lateinit var contactoNames: ArrayList<String>
    private lateinit var necessidades: ArrayList<String>
    private var idCliente by Delegates.notNull<Int>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        clientNames = intent.getStringArrayListExtra("clienteNome")!!
        clienteIds = intent.getIntegerArrayListExtra("clienteIds")!!
        contactoIds = intent.getIntegerArrayListExtra("contactoIds")!!
        contactoNames = intent.getStringArrayListExtra("contactoNames")!!
        necessidades = intent.getStringArrayListExtra("necessidades")!!


        Log.i("clientNames", clientNames.toString())
        Log.i("clienteIds", clienteIds.toString())
        Log.i("contactoIds", contactoIds.toString())
        Log.i("contactoNames", contactoNames.toString())
        Log.i("necessidades", necessidades.toString())

        val lista = findViewById<ListView>(R.id.listaContactosCliente22)
        contactosAdapter = ContactosAdapter(
            contactosList,
            R.layout.item_contacto_cliente,
            intent.getStringArrayListExtra("clienteNome")!!,
            clienteIds,
            intent.getIntegerArrayListExtra("contactoIds")!!,
            intent.getStringArrayListExtra("contactoNames")!!,
            intent.getStringArrayListExtra("necessidades")!!,
        )

        if (clienteIds.isEmpty())
        {
            val intent = Intent(this, CriarNegocioActivity::class.java)
            Toast.makeText(this, "Selecione um cliente primeiro", Toast.LENGTH_SHORT).show()
            startActivity(intent)
            overridePendingTransition(0, 0);
        } else {
            idCliente  = clienteIds[0]
        }





        lista.adapter = contactosAdapter

        listaContactosCliente(contactosList, allContactosList, contactosAdapter,this, idCliente)

        val search = findViewById<EditText>(R.id.pesquisa)
        search.setOnEditorActionListener { _, actionId, event ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {

                contactosList.clear()

                for (contacto in allContactosList) {
                    if (contacto.compareToString(search.text.toString())) {
                        contactosList.add(contacto)
                    }
                }

                contactosAdapter.notifyDataSetChanged()

                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class ContactosAdapter(private val contactos: ArrayList<Contacto>, private val item: Int, private val clienteNome: ArrayList<String> = ArrayList(), private val clienteIds: ArrayList<Int> = ArrayList(), private val contactoIds: ArrayList<Int> = ArrayList(),  private val contactoNames: ArrayList<String> = ArrayList(),private val necessidades: ArrayList<String> = ArrayList() ) : BaseAdapter(){
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val contacto = contactos[position]

            val idClienteContacto = view.findViewById<TextView>(R.id.idCliente)
            val valueContacto = view.findViewById<TextView>(R.id.valueContacto)

            idClienteContacto.text = contacto.idCliente.toString()
            valueContacto.text = contacto.value

            Log.i("clienteIds", clienteIds.toString())
            Log.i("clienteNome", clienteNome.toString())
            Log.i("contactoIds", contactoIds.toString())
            Log.i("contactoNames", contactoNames.toString())
            Log.i("necessidades", necessidades.toString())

            view.setOnClickListener {
                val intent = Intent(view.context, CriarNegocioActivity::class.java)

                contactoIds.add(contacto.idContacto)
                contactoNames.add(contacto.value)

                intent.putExtra("clienteNome", clienteNome)
                intent.putExtra("clienteIds", clienteIds)
                intent.putExtra("contactoIds", contactoIds)
                intent.putExtra("contactoNames", contactoNames)
                intent.putExtra("necessidades", necessidades)

                Log.i("clienteIds", clienteIds.toString())
                Log.i("clienteNome", clienteNome.toString())
                Log.i("contactoIds", contactoIds.toString())
                Log.i("contactoNames", contactoNames.toString())
                Log.i("necessidades", necessidades.toString())

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

    fun adicionarNovoContactoCliente(view: View) {
        val intent = Intent(this, CriarContactoClienteActivity::class.java)

        intent.putExtra("clienteNome", clientNames)
        intent.putExtra("clienteIds", clienteIds)
        intent.putExtra("contactoIds", contactoIds)
        intent.putExtra("contactoNames", contactoNames)

        startActivity(intent)
        overridePendingTransition(0, 0);
    }

}