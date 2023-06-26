package com.example.pint_mobile.pages.admin.edit

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.provider.MediaStore
import android.view.View
import android.widget.Button
import android.widget.CheckBox
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createVaga
import com.example.pint_mobile.utils.uploadFile
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.textfield.TextInputEditText

class CriarVagaActivity : ActivityBase(R.layout.activity_criar_vaga, "Criar Vaga") {
    private var icone: String? = null
    private val PICK_IMAGE_REQUEST = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

        val setIconBtn = findViewById<Button>(R.id.vagaIconPicker)
        setIconBtn.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, PICK_IMAGE_REQUEST)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            val imageUri = data.data

            val icon = findViewById<TextInputEditText>(R.id.iconVagaEdit)
            icon.setText("A carregar...")

            val criarBtn = findViewById<Button>(R.id.criarVagaBtn)
            criarBtn.isEnabled = false

            uploadFile(this, imageUri!!, true) {
                runOnUiThread {
                    if (it != null) {
                        icone = it
                        icon.setText("Icon carregado")
                    } else {
                        Toast.makeText(this, "Erro ao carregar icone", Toast.LENGTH_SHORT).show()
                        icon.setText("")
                    }

                    criarBtn.isEnabled = true
                }
            }
        }
    }

    fun criarVaga(_view: View) {
        val titulo = findViewById<TextInputEditText>(R.id.tituloVagaCriar)
        val descricao = findViewById<TextInputEditText>(R.id.descricaoVagaCriar)
        val numeroVagas = findViewById<TextInputEditText>(R.id.numeroVagasCriar)
        val publico = !findViewById<CheckBox>(R.id.checkBoxVaga2).isChecked
        val status =
            findViewById<MaterialButtonToggleGroup>(R.id.toggleButton).checkedButtonId == R.id.aberta

        val statusInt = if (status) 0 else 1

        var errorMsg: String? = null

        if (titulo.text.toString().isEmpty()) {
            titulo.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Título não pode estar vazio"
        } else if (descricao.text.toString().isEmpty()) {
            descricao.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Descrição não pode estar vazia"
        } else if (numeroVagas.text.toString().isEmpty() || numeroVagas.text.toString()
                .toInt() <= 0
        ) {
            numeroVagas.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Número de vagas não pode estar vazio e tem de ser maior que 0"
        } else if (icone == null) {
            val icon2 = findViewById<TextInputEditText>(R.id.iconVaga)
            icon2.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Icone não pode estar vazio"
        }

        if (errorMsg != null) {
            Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show()
            return
        }

        createVaga(
            titulo.text.toString(),
            descricao.text.toString(),
            numeroVagas.text.toString().toInt(),
            publico,
            statusInt,
            icone!!,
            this
        )
    }

    fun cancelarVaga(_view: View) {
        finish()
    }
}
