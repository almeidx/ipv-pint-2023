package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.ContactsContract.CommonDataKinds.Email
import android.util.Log
import android.view.View
import android.widget.CheckBox
import android.widget.EditText
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createClient
import com.example.pint_mobile.utils.createContactoClient

class CriarContactoClienteActivity : ActivityBase(R.layout.activity_criar_negocio, "Criar Contacto") {

    private lateinit var clientNames: ArrayList<String>
    private lateinit var clienteIds: ArrayList<Int>
    private lateinit var contactoIds: ArrayList<Int>
    private lateinit var contactoNames: ArrayList<String>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_criar_contacto_cliente)

        clientNames = intent.getStringArrayListExtra("clienteNome")!!
        clienteIds = intent.getIntegerArrayListExtra("clienteIds")!!
        contactoIds = intent.getIntegerArrayListExtra("contactoIds")!!
        contactoNames = intent.getStringArrayListExtra("contactoNames")!!

        Log.i("clientNames", clientNames.toString())
        Log.i("clienteIds", clienteIds.toString())
        Log.i("contactoIds", contactoIds.toString())
        Log.i("contactoNames", contactoNames.toString())
    }

    fun criarNovoCliente(view: View) {
        val EmailcheckBox = findViewById<CheckBox>(R.id.checkboxEmail)
        val contacto = findViewById<EditText>(R.id.contactoClienteEditText).text.toString()
        val clienteID = clienteIds[0]

        val type = if (EmailcheckBox.isChecked) 0 else 1

        createContactoClient(clienteID , type, contacto, clientNames, clienteIds, contactoIds, contactoNames,this)
    }

}