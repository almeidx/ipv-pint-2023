package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.Toast
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.mudarPasswordPerfil
import com.google.android.material.textfield.TextInputEditText

class MudarPasswordActivity : ActivityBase(R.layout.activity_mudar_password) {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        getSupportActionBar()?.hide()
    }
    fun submeterNovaPassword(view: View) {
        val PasswordAtual = findViewById<TextInputEditText>(R.id.PasswordAtual).text.toString()
        val NovaPassword = findViewById<TextInputEditText>(R.id.NovaPassword2).text.toString()
        val ConfirmarNovaPassword =
            findViewById<TextInputEditText>(R.id.confirmarPassword).text.toString()

        if (PasswordAtual.isEmpty() || NovaPassword.isEmpty() || ConfirmarNovaPassword.isEmpty()) {
            Toast.makeText(this, "A password atual não pode estar vazia", Toast.LENGTH_SHORT).show()
            return;
        } else if (NovaPassword != ConfirmarNovaPassword) {
            Toast.makeText(this, "As passwords não coincidem", Toast.LENGTH_SHORT).show()
            return;
        }

        var errorMsg: String? = null

        if (NovaPassword.isEmpty()) {
            errorMsg = "Campo obrigatório"
        }else if (NovaPassword.length < 8 ) {
            errorMsg = "A password tem de ter pelo menos 8 caracteres"
        } else if (NovaPassword.length > 128) {
            errorMsg = "A password tem de ter menos de 128 caracteres"
        } else if (!NovaPassword.matches(".*[A-Z].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos uma letra maiúscula"
        } else if (!NovaPassword.matches(".*[a-z].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos uma letra minúscula"
        } else if (!NovaPassword.matches(".*[0-9].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos um número"
        } else if (!NovaPassword.matches(".*[^a-zA-Z0-9].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos um caracter especial"
        }

        if (errorMsg != null) {
            Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show()
            val confirmPasswordInput = findViewById<EditText>(R.id.password)
            confirmPasswordInput.setBackgroundResource(R.drawable.edittext_red_border)
            return;
        }

        mudarPasswordPerfil(PasswordAtual, NovaPassword, this)

    }
}
