package com.example.pint_mobile.pages.admin.edit

import android.content.Context
import android.content.Intent
import android.hardware.Camera
import android.hardware.Camera.Area
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.BaseAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.Spinner
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.AdminIdeiasActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.AreaNegocio
import com.example.pint_mobile.utils.Ideia
import com.example.pint_mobile.utils.createNegocio
import com.example.pint_mobile.utils.listaIdeias
import com.example.pint_mobile.utils.listarAreasNegocio
import com.google.android.material.bottomnavigation.BottomNavigationView
import kotlin.properties.Delegates

class CriarNegocioActivity : ActivityBase(R.layout.activity_criar_negocio, "Criar Negócio") {

    private lateinit var clientNames: ArrayList<String>
    private lateinit var clienteIds: ArrayList<Int>
    private lateinit var contactoIds: ArrayList<Int>
    private lateinit var contactoNames: ArrayList<String>
    var areaNegocioId by Delegates.notNull<Int>()

    private val areasList = ArrayList<AreaNegocio>()
    private lateinit var areasAdapter: AreaNegocioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val spinner = findViewById<Spinner>(R.id.areadeNegocio)

        areasAdapter = AreaNegocioAdapter(
            this,
            areasList
        )


        //areasAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = areasAdapter


        listarAreasNegocio(
            areasList,
            areasAdapter,
            this
        )

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedItem = parent.getItemAtPosition(position) as AreaNegocio
                areaNegocioId = selectedItem.id
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        clientNames = intent.getStringArrayListExtra("clienteNome") ?: ArrayList()
        clienteIds = intent.getIntegerArrayListExtra("clienteIds") ?: ArrayList()
        contactoIds = intent.getIntegerArrayListExtra("contactoIds") ?: ArrayList()
        contactoNames = intent.getStringArrayListExtra("contactoNames") ?: ArrayList()

        Log.i("clientNames", clientNames.toString())
        Log.i("clienteIds", clienteIds.toString())
        Log.i("contactoIds", contactoIds.toString())
        Log.i("contactoNames", contactoNames.toString())

        val clienteDoNegocio = findViewById<EditText>(R.id.clienteNegocioCriar)
        if(clientNames.size == 1){
            clienteDoNegocio.setText(clientNames[0])
        }

        val contactoClientes = findViewById<EditText>(R.id.contactoClienteMostrar)
        val todosOsNomes = java.lang.String.join(", ", contactoNames)
        contactoClientes.setText(todosOsNomes)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

    }

    class AreaNegocioAdapter(val context: Context, val dataSource: ArrayList<AreaNegocio>) :
        BaseAdapter() {

        private val inflater: LayoutInflater =
            context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater

        override fun getCount(): Int {
            return dataSource.size
        }

        override fun getItem(position: Int): Any {
            return dataSource[position]
        }

        override fun getItemId(position: Int): Long {
            val areaNegocio = getItem(position) as AreaNegocio
            return areaNegocio.id.toLong()
        }

        override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
            val rowView = inflater.inflate(androidx.appcompat.R.layout.support_simple_spinner_dropdown_item, parent, false)

            val areaNegocio = getItem(position) as AreaNegocio

            val nomeArea = rowView.findViewById<TextView>(android.R.id.text1)

            nomeArea.text = areaNegocio.nome

            return rowView
        }
    }

    fun AdicionarClienteNegocio(view: View) {
        val intent = Intent(this, AdicionarClienteNegocioActivity::class.java)
        intent.putExtra("clienteNome", clientNames)
        intent.putExtra("clienteIds", clienteIds)
        startActivity(intent)
    }

    fun AdicionarContactoNegocio(view: View) {
        val intent = Intent(this, SelectContactoClienteNegocioActivity::class.java)
        intent.putExtra("clienteIds", clienteIds)
        intent.putExtra("clienteNome", clientNames)
        intent.putExtra("contactoIds", contactoIds)
        intent.putExtra("contactoNome", contactoNames)
        startActivity(intent)
    }

    fun criarNovoNegocio(view: android.view.View) {
        val titulo = findViewById<EditText>(R.id.tituloNegocioCriar)
        val descricao = findViewById<EditText>(R.id.descricaoNegocioCriar)

        val tituloText = titulo.text.toString()
        val descricaoText = descricao.text.toString()

        val clienteID = clienteIds[0]

        createNegocio(
            tituloText,
            areaNegocioId,
            descricaoText,
            clienteID,
            contactoIds,
            this
        )
    }
}
