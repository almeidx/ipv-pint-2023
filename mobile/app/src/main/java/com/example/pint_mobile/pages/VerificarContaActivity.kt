package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R

class VerificarContaActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_verificar_conta)
        supportActionBar?.title = "Verificar Conta"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun SubmeterCodigo(_view: View) {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
    }

    fun ReenviarCodigo() {

    }
}