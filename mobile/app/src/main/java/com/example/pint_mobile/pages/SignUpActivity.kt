package com.example.pint_mobile.pages

import android.content.Intent
import android.view.View
import android.widget.EditText
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.signup

class SignUpActivity : ActivityBase(R.layout.activity_sign_up) {
    fun criarConta(_view: View) {
        val nome = findViewById<EditText>(R.id.nome).text.toString()
        val apelido = findViewById<EditText>(R.id.apelido).text.toString()
        val email = findViewById<EditText>(R.id.email).text.toString()
        val password = findViewById<EditText>(R.id.password).text.toString()
        val confirmPassword = findViewById<EditText>(R.id.confirmPassword).text.toString()

        if (nome.isEmpty()) {
            val nomeInput = findViewById<EditText>(R.id.nome)
            nomeInput.setBackgroundResource(R.drawable.edittext_red_border)
            return;
        }
        if (apelido.isEmpty()) {
            val apelidoInput = findViewById<EditText>(R.id.apelido)
            apelidoInput.setBackgroundResource(R.drawable.edittext_red_border)
            return;
        }

        if (email.isEmpty()) {
            val emailInput = findViewById<EditText>(R.id.email)
            emailInput.setBackgroundResource(R.drawable.edittext_red_border)
            return;
        }

        var errorMsg: String? = null

        if (password.isEmpty()) {
            errorMsg = "Campo obrigatório"
        }else if (password.length < 8 ) {
            errorMsg = "A password tem de ter pelo menos 8 caracteres"
        } else if (password.length > 128) {
            errorMsg = "A password tem de ter menos de 128 caracteres"
        } else if (!password.matches(".*[A-Z].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos uma letra maiúscula"
        } else if (!password.matches(".*[a-z].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos uma letra minúscula"
        } else if (!password.matches(".*[0-9].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos um número"
        } else if (!password.matches(".*[^a-zA-Z0-9].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos um caracter especial"
        }

        if (errorMsg != null) {
            Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show()
            val confirmPasswordInput = findViewById<EditText>(R.id.password)
            confirmPasswordInput.setBackgroundResource(R.drawable.edittext_red_border)
            return;
        }

        if (password != confirmPassword) {
            Toast.makeText(this, "As passwords não coincidem", Toast.LENGTH_SHORT).show()
            val confirmPasswordInput = findViewById<EditText>(R.id.confirmPassword)
            confirmPasswordInput.setBackgroundResource(R.drawable.edittext_red_border)
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
        overridePendingTransition(0, 0);
    }
}
