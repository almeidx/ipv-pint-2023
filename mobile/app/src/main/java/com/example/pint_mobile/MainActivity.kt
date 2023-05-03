package com.example.pint_mobile

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import com.example.pint_mobile.pages.*

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val sharedPreferences = getSharedPreferences("sharedPrefs", Context.MODE_PRIVATE)

        val cookie = sharedPreferences.getString("cookie", "") ?: ""
        val user = sharedPreferences.getString("user", "") ?: ""

        Toast.makeText(
            this,
            user,
            Toast.LENGTH_LONG
        ).show()
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
        val intent = Intent(this, PerfilUtilizadorActivity::class.java)
        startActivity(intent)
    }

    fun gotoNotificacoes(_view: View){
        val intent = Intent(this, NotificacoesActivity::class.java)
        startActivity(intent)
    }
}
