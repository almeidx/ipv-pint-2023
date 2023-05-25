package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.view.View
import android.widget.CheckBox
import android.widget.EditText
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createVaga
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.textfield.TextInputEditText

class CriarVagaActivity : ActivityBase(R.layout.activity_criar_vaga, "Criar Vaga") {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun criarVaga(view: View) {
        val titulo = findViewById<TextInputEditText>(R.id.tituloVagaCriar).text.toString()
        val descricao = findViewById<TextInputEditText>(R.id.descricaoVagaCriar).text.toString()
        val numeroVagas = findViewById<TextInputEditText>(R.id.numeroVagasCriar).text.toString().toInt()
        val publico = !findViewById<CheckBox>(R.id.checkBoxVaga2).isChecked
        val status = findViewById<MaterialButtonToggleGroup>(R.id.toggleButton).checkedButtonId == R.id.aberta
        val icon = findViewById<TextInputEditText>(R.id.iconVagaCriar).text.toString()

        val statusInt = if (status) 0 else 1

        createVaga(titulo, descricao, numeroVagas, publico, statusInt, icon, this)
    }
}
