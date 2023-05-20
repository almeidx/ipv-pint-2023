package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.util.Log
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createNegocio

class CriarNegocioActivity : ActivityBase(R.layout.activity_criar_negocio, "Criar Negócio") {

    private lateinit var clientNames: ArrayList<String>
    private lateinit var clienteIds: ArrayList<Int>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        clientNames = intent.getStringArrayListExtra("clienteNome") ?: ArrayList()
        clienteIds = intent.getIntegerArrayListExtra("clienteIds") ?: ArrayList()

        Log.i("clientNames", clientNames.toString())
        Log.i("clienteIds", clienteIds.toString())

        val clienteDoNegocio = findViewById<android.widget.EditText>(R.id.clienteNegocioCriar)
        if(clientNames.size == 1){
            clienteDoNegocio.setText(clientNames[0])
        }
    }

    fun AdicionarClienteNegocio(view: android.view.View) {
        val intent = android.content.Intent(this, AdicionarClienteNegocioActivity::class.java)
        intent.putExtra("clienteNome", clientNames)
        intent.putExtra("clienteIds", clienteIds)
        startActivity(intent)
    }

    fun AdicionarContactoNegocio(view: android.view.View) {
        val intent = android.content.Intent(this, SelectContactoClienteNegocioActivity::class.java)
        intent.putExtra("clienteIds", clienteIds)
        startActivity(intent)
    }

    fun CriarCliente(view: android.view.View) {
        val intent = android.content.Intent(this, CriarClienteActivity::class.java)
        intent.putExtra("clienteNome", clientNames)
        intent.putExtra("clienteIds", clienteIds)
        startActivity(intent)
    }
    fun criarNegocio(view: android.view.View) {
        val titulo = findViewById<android.widget.EditText>(R.id.tituloNegocioCriar)
        val descricao = findViewById<android.widget.EditText>(R.id.descricaoNegocioCriar)
        val area = findViewById<android.widget.EditText>(R.id.areaDoNegocioCriar)
        val cliente = findViewById<android.widget.EditText>(R.id.clienteNegocioCriar)

        val tituloText = titulo.text.toString()
        val descricaoText = descricao.text.toString()
        val areaText = area.text.toString()
        val clienteText = cliente.text.toString()

    }
}
