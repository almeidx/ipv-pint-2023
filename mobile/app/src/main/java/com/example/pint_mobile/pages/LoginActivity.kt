package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.login
import com.example.pint_mobile.utils.setupActivityListeners
import com.google.android.material.textfield.TextInputEditText

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        setupActivityListeners(window, supportActionBar, this)
    }

    fun loginBtn(_view: View) {
        val emailInput = findViewById<TextInputEditText>(R.id.email)
        val passwordInput = findViewById<TextInputEditText>(R.id.password)

        val email = emailInput.text.toString()
        val password = passwordInput.text.toString()

        login(email, password, this)
    }

    fun loginGoogle(_view: View) {

    }

    fun loginFacebook(_view: View) {

    }

    fun esqueceuPassword(_view: View) {
        val intent = Intent(this, EsqueceuPasswordActivity::class.java)
        startActivity(intent)
    }

    fun aindaNaoTemConta(_view: View) {
        val intent = Intent(this, SignUpActivity::class.java)
        startActivity(intent)
    }
}
