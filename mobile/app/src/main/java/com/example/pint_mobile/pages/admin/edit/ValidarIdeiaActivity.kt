package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.view.View
import android.widget.CheckBox
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.deleteIdeia
import com.example.pint_mobile.utils.editIdeia
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.textfield.TextInputEditText

class ValidarIdeiaActivity : ActivityBase(R.layout.activity_validar_ideia, "Validar Ideia") {

    private var id = 0
    private var validacao = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val data = intent.getStringExtra("data")
        val criador = intent.getStringExtra("criador")
        id = intent.getIntExtra("id", 0)
        validacao = intent.getBooleanExtra("validacao", false)


        val tituloIdeiaEdit = findViewById<TextInputEditText>(R.id.tituloIdeiaEdit)
        tituloIdeiaEdit.setText(titulo)

        val descricaoIdeiaEdit = findViewById<TextInputEditText>(R.id.descricaoIdeiaEdit)
        descricaoIdeiaEdit.setText(descricao)

        val dataIdeiaEdit = findViewById<TextInputEditText>(R.id.dataIdeiaEdit)
        dataIdeiaEdit.setText(data)

        val nomeIdeiaEdit = findViewById<TextInputEditText>(R.id.criadorIdeiaEdit)
        nomeIdeiaEdit.setText(criador)

        val validacaoIdeiaEdit = findViewById<CheckBox>(R.id.checkBoxIdeia)
        validacaoIdeiaEdit.isChecked = validacao

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun apagarIdeia(view: View) {
        deleteIdeia(id, this)
    }

    fun editarIdeia2(_view: View) {

        val validacao = findViewById<CheckBox>(R.id.checkBoxIdeia).isChecked

        editIdeia(id, validacao, this)
    }

}
