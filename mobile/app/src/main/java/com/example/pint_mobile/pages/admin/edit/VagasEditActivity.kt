package com.example.pint_mobile.pages.admin.edit

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.editVaga
import com.example.pint_mobile.utils.uploadFile
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.textfield.TextInputEditText

class VagasEditActivity : ActivityBase(R.layout.activity_vagas_edit, "Editar Vaga") {

    private var id = 0
    private val PICK_IMAGE_REQUEST = 1
    private var icone: String? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        id = intent.getIntExtra("id", 0)
        val publico = intent.getStringExtra("publico")
        val numeroVagas = intent.getStringExtra("slots")
        val status = intent.getIntExtra("status", -1)

        Log.i("publico", publico.toString())

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
        publicoTextView.isChecked = publico == "Colaboradores"

        val toggleButton = findViewById<MaterialButtonToggleGroup>(R.id.toggleButton2)
        val button1 = findViewById<Button>(R.id.aberta)
        val button2 = findViewById<Button>(R.id.fechada)

        if (status == 0) {
            toggleButton.check(button1.id)
        } else if (status == 1) {
            toggleButton.check(button2.id)
        }

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

        val btnIcon = findViewById<Button>(R.id.imagePickerX3)
        btnIcon.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, PICK_IMAGE_REQUEST)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            val imageUri = data.data


            val criarBtn = findViewById<Button>(R.id.editarVagaX3)
            criarBtn.isEnabled = false

            uploadFile(this, imageUri!!, true) {
                runOnUiThread {
                    if (it != null) {
                        icone = it

                    } else {
                        Toast.makeText(this, "Erro ao carregar icone", Toast.LENGTH_SHORT).show()
                    }

                    criarBtn.isEnabled = true
                }
            }
        }
    }

    fun editarVaga(view: View) {
        val titulo = findViewById<TextInputEditText>(R.id.tituloVagaEdit).text.toString()
        val descricao = findViewById<TextInputEditText>(R.id.descricaoVagaEdit).text.toString()
        val numeroVagas =
            findViewById<TextInputEditText>(R.id.numeroVagasEdit).text.toString().toInt()
        val publico = findViewById<CheckBox>(R.id.checkBoxVaga).isChecked.not()
        val toggleButton = findViewById<MaterialButtonToggleGroup>(R.id.toggleButton2)

        val statusInt = if (toggleButton.checkedButtonId == R.id.aberta) 0 else 1

        editVaga(id, titulo, descricao, numeroVagas, publico, statusInt, icone!!, this)
    }
}
