package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners
import com.google.android.material.textfield.TextInputEditText

class BeneficiosEditActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_beneficios_edit)

        setupActivityListeners(window, supportActionBar, this, "Editar Benefício", findViewById(R.id.bottombar))

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")


        val tituloShow = findViewById<TextView>(R.id.titulo)
        tituloShow.text = titulo

        val tituloTextView = findViewById<TextInputEditText>(R.id.tituloBeneficioEdit)
        tituloTextView.setText(titulo)

        val descricaoTextView = findViewById<TextInputEditText>(R.id.descricaoBeneficioEdit)
        descricaoTextView.setText(descricao)
    }



    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

}