package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createClient
import com.google.android.material.bottomnavigation.BottomNavigationView

class CriarClienteActivity : ActivityBase(R.layout.activity_criar_cliente, "Criar Cliente") {

    private lateinit var clienteNome: ArrayList<String>
    private lateinit var clienteIds: ArrayList<Int>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        clienteNome = intent.getStringArrayListExtra("clienteNome") ?: ArrayList()
        clienteIds = intent.getIntegerArrayListExtra("clienteIds") ?: ArrayList()

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

    }

    fun criarCliente(view: View) {
        val nome = findViewById<android.widget.EditText>(R.id.nomeNovoClienteEditText)

        val nomeText = nome.text.toString()

        createClient(nomeText, clienteNome, clienteIds, this)
    }
}