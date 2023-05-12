package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners

class EditNegocioActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_negocio)

        setupActivityListeners(window, supportActionBar, this, "Editar Negócio")

        val FuncionarioName = intent.getStringExtra("FuncionarioName")
        val FuncionarioEmail = intent.getStringExtra("FuncionarioEmail")
        val centroTrabalhoName = intent.getStringExtra("centroTrabalhoName")
        val centroTrabalhoLocation = intent.getStringExtra("centroTrabalhoLocation")
        val centroTrabalhoPostalCode = intent.getStringExtra("centroTrabalhoPostalCode")
        val centroTrabalhoAdress = intent.getStringExtra("centroTrabalhoAdress")
        val cliente = intent.getStringExtra("Cliente")
        val status = intent.getIntExtra("status", 0)



        val clienteEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.clienteNegocioEdit)
        clienteEdit.setText(cliente)
        clienteEdit.isFocusable = false
        clienteEdit.isFocusableInTouchMode = false

        val statusEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.statusNegocioEdit)
        statusEdit.setText(if(status == 1) "Em espera"
                            else if(status == 2) "A validar"
                            else if(status == 3) "Em desenvolvimento"
                            else if(status == 4) "Em conclusão"
                            else if(status == 5) "Concluído"
                            else "Cancelado")

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

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}