package com.example.pint_mobile.pages.admin.edit

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.provider.MediaStore
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.deleteBeneficio
import com.example.pint_mobile.utils.editBeneficio
import com.example.pint_mobile.utils.uploadFile
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.textfield.TextInputEditText

class BeneficiosEditActivity : ActivityBase(R.layout.activity_beneficios_edit, "Editar Benefício") {

    private var id = 0
    private val PICK_IMAGE_REQUEST = 1
    private var icone: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        id = intent.getIntExtra("id", 0)
        val icon = intent.getStringExtra("icon")
        val dataValidade = intent.getStringExtra("dataValidade")

        val tituloShow = findViewById<TextView>(R.id.titulo)
        tituloShow.text = titulo

        val tituloTextView = findViewById<TextInputEditText>(R.id.tituloBeneficioEdit)
        tituloTextView.setText(titulo)

        val descricaoTextView = findViewById<TextInputEditText>(R.id.descricaoBeneficioEdit)
        descricaoTextView.setText(descricao)

        val dataValidadeTextView = findViewById<TextInputEditText>(R.id.dataValidadeBeneficioEdit)
        dataValidadeTextView.setText(dataValidade)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

        val btnIcon = findViewById<Button>(R.id.imagePickerX2)
        btnIcon.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, PICK_IMAGE_REQUEST)
        }

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            val imageUri = data.data


            val criarBtn = findViewById<Button>(R.id.EditarBeneficio)
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

    fun removerBeneficio(_view: View) {
        deleteBeneficio(id, this)
    }

    fun editarBeneficio(_view: View) {
        val tituloTextView = findViewById<TextInputEditText>(R.id.tituloBeneficioEdit)
        val descricaoTextView = findViewById<TextInputEditText>(R.id.descricaoBeneficioEdit)
        val dataValidadeTextView = findViewById<TextInputEditText>(R.id.dataValidadeBeneficioEdit)

        val titulo = tituloTextView.text.toString()
        val descricao = descricaoTextView.text.toString()
        val dataValidade = dataValidadeTextView.text.toString()

        if (titulo.isEmpty() || descricao.isEmpty() || dataValidade.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos!", Toast.LENGTH_SHORT).show()
            return
        }

        editBeneficio(id, titulo, descricao, icone!!, dataValidade, this)
    }
}
