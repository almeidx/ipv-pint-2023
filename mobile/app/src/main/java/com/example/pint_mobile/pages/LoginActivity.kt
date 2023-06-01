package com.example.pint_mobile.pages

import android.content.Intent
import android.view.View
import android.widget.Button
import android.widget.Toast
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.login
import com.google.android.material.textfield.TextInputEditText
import com.facebook.FacebookSdk
import com.facebook.appevents.AppEventsLogger
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions

class LoginActivity : ActivityBase(R.layout.activity_login) {
    fun loginBtn(_view: View) {
        val emailInput = findViewById<TextInputEditText>(R.id.email)
        val passwordInput = findViewById<TextInputEditText>(R.id.password)

        val email = emailInput.text.toString()
        val password = passwordInput.text.toString()

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()

            if (email.isEmpty()) {
                emailInput.setBackgroundResource(R.drawable.edittext_red_border)
            }
            if (password.isEmpty()) {
                passwordInput.setBackgroundResource(R.drawable.edittext_red_border)
            }
        }
        login(email, password, this)
    }

    fun loginGoogle(_view: View) {

    }

    fun loginFacebook(_view: View) {
        val btnface = findViewById<Button>(R.id.loginFacebook)
        btnface.setOnClickListener {

        }
    }

    fun esqueceuPassword(_view: View) {
        val intent = Intent(this, EsqueceuPasswordActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun aindaNaoTemConta(_view: View) {
        val intent = Intent(this, SignUpActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);

    }
}
