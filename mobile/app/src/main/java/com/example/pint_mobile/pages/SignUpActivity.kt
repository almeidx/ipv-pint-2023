package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners
import com.example.pint_mobile.utils.signup

class SignUpActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)

        setupActivityListeners(window, supportActionBar, this)
    }

    fun criarConta(_view: View) {
        val nome = findViewById<EditText>(R.id.nome).text.toString()
        val apelido = findViewById<EditText>(R.id.apelido).text.toString()
        val email = findViewById<EditText>(R.id.email).text.toString()
        val password = findViewById<EditText>(R.id.password).text.toString()
        val confirmPassword = findViewById<EditText>(R.id.confirmPassword).text.toString()

        if (nome.isEmpty() || apelido.isEmpty() || email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
            return;
        }

        if (password != confirmPassword) {
            Toast.makeText(this, "As passwords não coincidem", Toast.LENGTH_SHORT).show()
            return;
        }

        signup("$nome $apelido", email, password, this)
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
