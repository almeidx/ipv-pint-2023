package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.util.Log
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class EditNegocioActivity : ActivityBase(R.layout.activity_edit_negocio, "Editar Negócio") {

    private var idNegocio = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val FuncionarioName = intent.getStringExtra("FuncionarioName")
        val FuncionarioEmail = intent.getStringExtra("FuncionarioEmail")
        val centroTrabalhoName = intent.getStringExtra("centroTrabalhoName")
        val centroTrabalhoLocation = intent.getStringExtra("centroTrabalhoLocation")
        val centroTrabalhoPostalCode = intent.getStringExtra("centroTrabalhoPostalCode")
        val centroTrabalhoAdress = intent.getStringExtra("centroTrabalhoAdress")
        val cliente = intent.getStringExtra("Cliente")
        val status = intent.getIntExtra("status", 0)

        idNegocio = intent.getIntExtra("id", 0)


        val clienteEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.clienteNegocioEdit)
        clienteEdit.setText(cliente)
        clienteEdit.isFocusable = false
        clienteEdit.isFocusableInTouchMode = false

        val statusEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.statusNegocioEdit)
        statusEdit.setText(
            when (status) {
                1 -> "Em espera"
                2 -> "A validar"
                3 -> "Em desenvolvimento"
                4 -> "Em conclusão"
                5 -> "Concluído"
                else -> "Cancelado"
            }
        )

        Log.i("idNegocio", idNegocio.toString())

        val centroTrabalhoNameEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.centroTrabalhoNomeNegocioEdit)
        centroTrabalhoNameEdit.setText(centroTrabalhoName)

        val centroTrabalhoLocationEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.centroTrabalhoLocationNegocioEdit)
        centroTrabalhoLocationEdit.setText(centroTrabalhoLocation)

        val centroTrabalhoPostalCodeEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.centroTrabalhopostalCodeNegocioEdit)
        centroTrabalhoPostalCodeEdit.setText(centroTrabalhoPostalCode)

        val centroTrabalhoAdressEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.centroTrabalhoAdressNegocioEdit)
        centroTrabalhoAdressEdit.setText(centroTrabalhoAdress)

        val FuncionarioNameEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.funcionarioDoNegocioEdit)
        FuncionarioNameEdit.setText(FuncionarioName)

        val FuncionarioEmailEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.funcionarioEmailNegocioEdit)
        FuncionarioEmailEdit.setText(FuncionarioEmail)
    }

    fun goToCriarReuniao(view: View) {
        val intent = android.content.Intent(this, com.example.pint_mobile.pages.admin.edit.CriarReuniaoActivity::class.java)
        intent.putExtra("idNegocio", idNegocio)
        startActivity(intent)
    }
}
