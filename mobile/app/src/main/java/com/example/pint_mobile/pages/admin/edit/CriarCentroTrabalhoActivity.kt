package com.example.pint_mobile.pages.admin.edit

import android.view.View
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createCentroTrabalho

class CriarCentroTrabalhoActivity :
    ActivityBase(R.layout.activity_criar_centro_trabalho, "Criar Centro de Trabalho ") {

    fun criarCentroTrabalho(view: View) {
        val nome = findViewById<android.widget.EditText>(R.id.nomeCentroTrabalhoEditText)
        val location = findViewById<android.widget.EditText>(R.id.locationCentroTrabalhoEditText)
        val address = findViewById<android.widget.EditText>(R.id.addressCentroTrabalhoEditText)
        val postalCode =
            findViewById<android.widget.EditText>(R.id.postalCodeCentroTrabalhoEditText)

        val nomeString = nome.text.toString()
        val locationString = location.text.toString()
        val addressString = address.text.toString()
        val postalCodeString = postalCode.text.toString()

        if (nomeString.isEmpty()) {
            nome.setBackgroundResource(R.drawable.edittext_red_border)
            Toast.makeText(this, "Nome não pode ser vazio", Toast.LENGTH_SHORT).show()
            return
        } else if (locationString.isEmpty()) {
            location.setBackgroundResource(R.drawable.edittext_red_border)
            Toast.makeText(this, "Localização não pode ser vazia", Toast.LENGTH_SHORT).show()
            return
        } else if (addressString.isEmpty()) {
            address.setBackgroundResource(R.drawable.edittext_red_border)
            Toast.makeText(this, "Morada não pode ser vazia", Toast.LENGTH_SHORT).show()
            return
        } else if (postalCodeString.isEmpty()) {
            postalCode.setBackgroundResource(R.drawable.edittext_red_border)
            Toast.makeText(this, "Código Postal não pode ser vazio", Toast.LENGTH_SHORT).show()
            return
        }

        createCentroTrabalho(nomeString, locationString, addressString, postalCodeString, this)
    }
}