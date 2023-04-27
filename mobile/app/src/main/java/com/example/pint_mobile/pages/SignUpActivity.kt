package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.core.content.ContextCompat
import com.example.pint_mobile.R

class SignUpActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)

        window.statusBarColor = ContextCompat.getColor(this, R.color.loginStatusBarColor)
    }

    fun criarConta(_view: View) {
        val intent = Intent(this, VerificarContaActivity::class.java)
        startActivity(intent)
    }

    fun criarGoogle(_view: View) {

    }

    fun criarFacebook(_view: View) {

    }

    fun jaTemConta(_view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }
}
