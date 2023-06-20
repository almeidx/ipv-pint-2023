package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.Spinner
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.TipoUtilizador
import com.example.pint_mobile.utils.desativarUser
import com.example.pint_mobile.utils.editUser
import com.example.pint_mobile.utils.listaTipoUtilizador
import com.google.android.material.bottomnavigation.BottomNavigationView
import kotlin.properties.Delegates

class EditarUtilizadorActivity : ActivityBase(R.layout.activity_editar_utilizador, "Editar Utilizador") {
    lateinit var cargo: String
    var disable by Delegates.notNull<Boolean>()
    private var id by Delegates.notNull<Int>()

    private lateinit var tiposUser: ArrayList<TipoUtilizador>
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        id = intent.getIntExtra("id", -1)
        val nome = intent.getStringExtra("nome")
        val email = intent.getStringExtra("email")
        val cargoId = intent.getIntExtra("cargoId", -1)
        disable = intent.getBooleanExtra("disable", false)


        val nomeEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.NomeUtilizadorEdit)
        nomeEdit.setText(nome)

        val emailEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.EmailUtilizadorEdit)
        emailEdit.setText(email)

        val disableEdit = findViewById<Button>(R.id.DesativarUtilizador)
        if (disable) {
            disableEdit.text = "Ativar Utilizador"
        } else {
            disableEdit.text = "Desativar Utilizador"
        }

        val spinner = findViewById<Spinner>(R.id.cargos)

        listaTipoUtilizador(this) { lista ->
            val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, lista.map {
                it.nome
            })
            tiposUser = lista
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinner.adapter = adapter

            spinner.setSelection(cargoId - 1)
        }

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedItem = parent.getItemAtPosition(position).toString()
                cargo = selectedItem
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun desativarUtilizador(view: View) {
        disable = !disable
        Log.i("disable", disable.toString())
        val user = 0
        desativarUser(id, disable, user,this)
    }

    fun editarUser(view: View) {
        val spinner = findViewById<Spinner>(R.id.cargos)

        val cargoId =  tiposUser.find {
            it.nome == cargo
        }!!.id

        editUser(id, cargoId, this)
    }
}
