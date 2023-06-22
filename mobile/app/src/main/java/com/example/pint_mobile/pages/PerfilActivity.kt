package com.example.pint_mobile.pages

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.TipoUtilizadorEnum
import com.example.pint_mobile.utils.deleteCurrentUser
import com.example.pint_mobile.utils.desativarUser
import com.example.pint_mobile.utils.getCurrentUser
import kotlin.properties.Delegates

class PerfilActivity : ActivityBase(R.layout.activity_perfil, "Perfil") {

    private var id by Delegates.notNull<Int>()
    var disable by Delegates.notNull<Boolean>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nome = findViewById<TextView>(R.id.nomeUser)
        val email = findViewById<TextView>(R.id.emailUser)
        val user = getCurrentUser(this)
        val pag_admin = findViewById<TextView>(R.id.admin)
        val password = findViewById<TextView>(R.id.password)
        id = getCurrentUser(this)?.id ?: -1

        if(user != null && user.tipoUser != TipoUtilizadorEnum.Utilizador && user.tipoUser != TipoUtilizadorEnum.Colaborador) {
            pag_admin.visibility = View.VISIBLE
            pag_admin.setOnClickListener{
                val intent = Intent(this, AdminActivity::class.java)
                startActivity(intent)
                overridePendingTransition(0, 0);
            }
        }

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
        }
        else{
            builder.setMessage("Tem a certeza que pretende desativar a sua conta?")
            builder.setPositiveButton("Sim") { dialog, which ->
                disable = true
                val user = 1
                desativarUser(id, disable, user, this) { // Pass a callback function
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
}
