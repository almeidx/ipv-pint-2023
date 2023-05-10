package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import com.android.volley.Request
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.API_URL
import com.example.pint_mobile.utils.Tipo_Utilizador
import com.example.pint_mobile.utils.setupActivityListeners

class EditarUtilizadorActivity : AppCompatActivity() {

    lateinit var cargo: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_utilizador)

        setupActivityListeners(window, supportActionBar, this, "Editar Utilizador", findViewById(R.id.bottombar))



        val nome = intent.getStringExtra("nome")
        val email = intent.getStringExtra("email")

        val nomeEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.NomeUtilizadorEdit)
        nomeEdit.setText(nome)
        nomeEdit.isFocusable = false
        nomeEdit.isFocusableInTouchMode = false

        val emailEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.EmailUtilizadorEdit)
        emailEdit.setText(email)
        emailEdit.isFocusable = false
        emailEdit.isFocusableInTouchMode = false




    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}