package com.example.pint_mobile.pages

import android.content.Intent
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.login
import com.google.android.material.textfield.TextInputEditText

class LoginActivity : ActivityBase(R.layout.activity_login) {
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
