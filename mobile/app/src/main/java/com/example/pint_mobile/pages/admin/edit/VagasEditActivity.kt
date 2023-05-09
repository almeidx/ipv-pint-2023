package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.CheckBox
import android.widget.TextView
import android.widget.ToggleButton
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.textfield.TextInputEditText

class VagasEditActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_vagas_edit)

        setupActivityListeners(window, supportActionBar, this, "Editar Vaga", findViewById(R.id.bottombar))

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val id = intent.getStringExtra("id")
        val publico = intent.getStringExtra("publico")
        val numeroVagas = intent.getStringExtra("slots")
        val status = intent.getIntExtra("status", -1)


        val tituloShow = findViewById<TextView>(R.id.titulo)
        tituloShow.text = titulo

        val idTextView = findViewById<TextView>(R.id.id)
        idTextView.text = "Id: " + id

        val tituloTextView = findViewById<TextInputEditText>(R.id.tituloVagaEdit)
        tituloTextView.setText(titulo)

        val descricaoTextView = findViewById<TextInputEditText>(R.id.descricaoVagaEdit)
        descricaoTextView.setText(descricao)

        val numeroVagasTextView = findViewById<TextInputEditText>(R.id.numeroVagasEdit)
        numeroVagasTextView.setText(numeroVagas)

        val publicoTextView = findViewById<CheckBox>(R.id.checkBoxVaga)
        if (publico == "Aberta") {
            publicoTextView.isChecked = true
        } else {
            publicoTextView.isChecked = false
        }

        val toggleButton = findViewById<MaterialButtonToggleGroup>(R.id.toggleButton)
        val button1 = findViewById<Button>(R.id.aberta)
        val button2 = findViewById<Button>(R.id.fechada)

        Log.d("status", status.toString())

        if (status == 0) {
            toggleButton.check(button1.id)
        } else {
            toggleButton.check(button2.id)
        }

    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}