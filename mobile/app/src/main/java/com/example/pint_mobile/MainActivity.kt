package com.example.pint_mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatDelegate
import com.example.pint_mobile.pages.*
import com.example.pint_mobile.utils.getCookieValue
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.getUserInfo

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val cookie = getCookieValue(this)
        if (cookie != null) {
            getUserInfo(cookie, this)
        }

        val user = getCurrentUser(this)

        Toast.makeText(
            this,
            user?.name ?: "Não tem sessão iniciada",
            Toast.LENGTH_LONG
        ).show()

        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
    }

    fun gotoNegocios(_view: View) {
        val intent = Intent(this, NegociosActivity::class.java)
        startActivity(intent)
    }

    fun gotoLogin(_view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }

    fun gotoSignUp(_view: View) {
        val intent = Intent(this, SignUpActivity::class.java)
        startActivity(intent)
    }

    fun gotoBeneficios(_view: View) {
        val intent = Intent(this, BeneficiosActivity::class.java)
        startActivity(intent)
    }

    fun gotoMudarPassword(_view: View) {
        val intent = Intent(this, MudarPasswordActivity::class.java)
        startActivity(intent)
    }

    fun gotoIdeias(_view: View) {
        val intent = Intent(this, IdeiasActivity::class.java)
        startActivity(intent)
    }

    fun gotoContacto(_view: View) {
        val intent = Intent(this, ContactoActivity::class.java)
        startActivity(intent)
    }

    fun gotoVagas(_view: View) {
        val intent = Intent(this, VagasActivity::class.java)
        startActivity(intent)
    }

    fun gotoCriarReuniao(_view: View){
        val intent = Intent(this, CriarReuniaoActivity::class.java)
        startActivity(intent)
    }

    fun gotoPerfil(_view: View){
        val intent = Intent(this, PerfilActivity::class.java)
        startActivity(intent)
    }

    fun gotoNotificacoes(_view: View){
        val intent = Intent(this, NotificacoesActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdmin(_view: View){
        val intent = Intent(this, AdminActivity::class.java)
        startActivity(intent)
    }
}
