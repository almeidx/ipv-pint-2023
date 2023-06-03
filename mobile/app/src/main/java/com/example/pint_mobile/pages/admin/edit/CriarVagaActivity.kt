package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.view.View
import android.widget.CheckBox
import android.widget.EditText
import android.widget.Toast
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
        val numeroVagas = findViewById<TextInputEditText>(R.id.numeroVagasCriar).text.toString()
        val publico = !findViewById<CheckBox>(R.id.checkBoxVaga2).isChecked
        val status = findViewById<MaterialButtonToggleGroup>(R.id.toggleButton).checkedButtonId == R.id.aberta
        val icon = findViewById<TextInputEditText>(R.id.iconVagaCriar).text.toString()

        val statusInt = if (status) 0 else 1

        var errorMsg: String? = null

        if (status != true && status != false){
            val toggleButton = findViewById<MaterialButtonToggleGroup>(R.id.toggleButton)
            toggleButton.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Vaga tem de estar aberta ou fechada"
        } else if (titulo.isEmpty()) {
            val titulo2 = findViewById<TextInputEditText>(R.id.tituloVagaCriar)
            titulo2.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Título não pode estar vazio"
        } else if (descricao.isEmpty()) {
            val descricao2 = findViewById<TextInputEditText>(R.id.descricaoVagaCriar)
            descricao2.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Descrição não pode estar vazia"
        } else if (numeroVagas.isEmpty() || numeroVagas.toInt() <= 0) {
            val numeroVagas2 = findViewById<TextInputEditText>(R.id.numeroVagasCriar)
            numeroVagas2.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Número de vagas não pode estar vazio ou tem de ser maior que 0"
        } else if (icon.isEmpty()) {
            val icon2 = findViewById<TextInputEditText>(R.id.iconVagaCriar)
            icon2.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Icon não pode estar vazio"
        }

        if (errorMsg != null){
            Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show()
        return
        }

        createVaga(titulo, descricao, numeroVagas.toInt(), publico, statusInt, icon, this)
    }
}
