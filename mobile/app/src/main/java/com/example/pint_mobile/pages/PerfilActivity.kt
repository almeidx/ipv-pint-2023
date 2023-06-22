package com.example.pint_mobile.pages

import android.app.AlertDialog
import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.API_URL
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.TipoUtilizadorEnum
import com.example.pint_mobile.utils.Utilizador
import com.example.pint_mobile.utils.deleteCurrentUser
import com.example.pint_mobile.utils.desativarUser
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.uploadFile
import com.google.android.material.textfield.TextInputEditText
import kotlin.properties.Delegates

class PerfilActivity : ActivityBase(R.layout.activity_perfil, "Perfil") {

    private var id by Delegates.notNull<Int>()
    var disable by Delegates.notNull<Boolean>()
    private var user: Utilizador? = null

    private val PICK_PDF_REQUEST = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nome = findViewById<TextView>(R.id.nomeUser)
        val email = findViewById<TextView>(R.id.emailUser)
        user = getCurrentUser(this)
        val pag_admin = findViewById<TextView>(R.id.admin)
        val password = findViewById<TextView>(R.id.password)
        id = user?.id ?: -1

        if(user != null && user!!.tipoUser != TipoUtilizadorEnum.Utilizador && user!!.tipoUser != TipoUtilizadorEnum.Colaborador) {
            pag_admin.visibility = View.VISIBLE
            pag_admin.setOnClickListener{
                val intent = Intent(this, AdminActivity::class.java)
                startActivity(intent)
                overridePendingTransition(0, 0);
            }
        }

        val verCvBtn = findViewById<TextView>(R.id.verCv)
        verCvBtn.isEnabled = user != null && user!!.cv != null

        password.setOnClickListener{
            val intent = Intent(this, MudarPasswordActivity::class.java)
            startActivity(intent)
            overridePendingTransition(0, 0);
        }

        nome.text = user?.name ?: ""
        email.text = user?.email ?: ""
    }

    fun terminarSessao(_view: View) {
        val sessao = 0
        confirmarDesativarConta(sessao)
    }

    fun inativarConta(_view: View) {
        val conta = 1
        confirmarDesativarConta(conta)
    }

    fun confirmarDesativarConta( tipo: Int) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confimação")

        if (tipo == 0) {
            builder.setMessage("Tem a certeza que pretende terminar a sessão?")
            builder.setPositiveButton("Sim") { dialog, which ->
                deleteCurrentUser(this)
                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                overridePendingTransition(0, 0);
            }
        } else {
            builder.setMessage("Tem a certeza que pretende desativar a sua conta?")
            builder.setPositiveButton("Sim") { dialog, which ->
                disable = true
                val user = 1
                desativarUser(id, disable, user, this) {
                    deleteCurrentUser(this)
                    val intent = Intent(this, LoginActivity::class.java)
                    startActivity(intent)
                    overridePendingTransition(0, 0)
                }
            }
        }

        builder.setNegativeButton("Não") { dialog, which ->

        }

        val dialog = builder.create()
        dialog.show()
    }

    fun verCv(_view: View) {
        if (user != null && user!!.cv != null) {
            val url = API_URL + "/uploads/" + user!!.cv

            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse(url)
            startActivity(intent)
        }
    }

    fun enviarCv(_view: View) {
        val intent = Intent(Intent.ACTION_GET_CONTENT)
        intent.type = "application/pdf"

        startActivityForResult(intent, PICK_PDF_REQUEST)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_PDF_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            val imageUri = data.data

            uploadFile(this, imageUri!!, false) {
                runOnUiThread {
                    if (it != null) {
                        user!!.cv = it
                        Toast.makeText(this, "CV carregado com sucesso", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this, "Erro ao carregar o seu CV", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
}
