package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.CheckBox
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.deleteVaga
import com.example.pint_mobile.utils.editVaga
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.textfield.TextInputEditText

class VagasEditActivity : ActivityBase(R.layout.activity_vagas_edit, "Editar Vaga") {

   private var id = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        id = intent.getIntExtra("id", 0)
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
        publicoTextView.isChecked = publico == "Aberta"

        val toggleButton = findViewById<MaterialButtonToggleGroup>(R.id.toggleButton)
        val button1 = findViewById<Button>(R.id.aberta)
        val button2 = findViewById<Button>(R.id.fechada)

        Log.d("status", status.toString())

        toggleButton.check(if (status == 0) button1.id else button2.id)
    }

    fun apagarVaga(view: View) {
        deleteVaga(id, this)
    }

    fun editarVaga(view: View) {
        val titulo = findViewById<TextInputEditText>(R.id.tituloVagaEdit).text.toString()
        val descricao = findViewById<TextInputEditText>(R.id.descricaoVagaEdit).text.toString()
        val numeroVagas = findViewById<TextInputEditText>(R.id.numeroVagasEdit).text.toString().toInt()
        val publico = findViewById<CheckBox>(R.id.checkBoxVaga).isChecked
        val status = findViewById<MaterialButtonToggleGroup>(R.id.toggleButton).checkedButtonId == R.id.aberta


        val statusInt = if (status) 0 else 1

        editVaga(id, titulo, descricao, numeroVagas, publico, statusInt, this)
    }


}
