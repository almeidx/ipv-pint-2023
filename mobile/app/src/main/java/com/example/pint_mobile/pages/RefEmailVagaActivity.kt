package com.example.pint_mobile.pages

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.API_URL
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Utilizador
import com.example.pint_mobile.utils.candidatarVaga
import com.example.pint_mobile.utils.editarUtilizadorAtual
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.uploadFile
import kotlin.properties.Delegates

class RefEmailVagaActivity : ActivityBase(R.layout.activity_ref_email_vaga, "Referência de Email") {

    private val PICK_PDF_REQUEST = 1
    private var id by Delegates.notNull<Int>()
    private var user: Utilizador? = null

    private var idVaga by Delegates.notNull<Int>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        idVaga = intent.getIntExtra("idVaga", -1)

        user = getCurrentUser(this)
        id = user?.id ?: -1

        if(user?.cv == "null") {
            val verCvBtn = findViewById<Button>(R.id.btnVerCV)
            verCvBtn.visibility = View.GONE
        }else{
            val enviarCvBtn = findViewById<Button>(R.id.btnEnviarCV)
            enviarCvBtn.visibility = View.GONE
        }
    }

    fun enviarCV2(_view: View) {
        val intent = Intent(Intent.ACTION_GET_CONTENT)
        intent.type = "application/pdf"

        startActivityForResult(intent, PICK_PDF_REQUEST)
    }

    fun verCv(_view: View) {
        if (user != null && user!!.cv != null) {
            val url = API_URL + "/uploads/" + user!!.cv

            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse(url)
            startActivity(intent)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_PDF_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            val imageUri = data.data

            uploadFile(this, imageUri!!, false) {
                runOnUiThread {
                    if (it != null) {
                        user!!.cv = it
                        editarUtilizadorAtual(it, this)
                        Toast.makeText(this, "CV carregado com sucesso", Toast.LENGTH_SHORT).show()
                        val verCvBtn = findViewById<Button>(R.id.btnVerCV)
                        verCvBtn.visibility = View.VISIBLE
                        val enviarCvBtn = findViewById<Button>(R.id.btnEnviarCV)
                        enviarCvBtn.visibility = View.GONE
                    } else {
                        Toast.makeText(this, "Erro ao carregar o seu CV", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    fun candidatar(_view: View) {
        val emailRef = findViewById<TextView>(R.id.refEmailVagaEditInput).text.toString()

        if (emailRef.isEmpty()) {
            candidatarVaga(idVaga, null, this)
        }else{
            candidatarVaga(idVaga, emailRef, this)
        }
    }
}