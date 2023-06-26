package com.example.pint_mobile.pages

import android.os.Bundle
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.enviarCodigoConfirmacao
import com.example.pint_mobile.utils.reenviarCodigoConfirmacao
import kotlin.properties.Delegates

class ConfirmarContaActivity : ActivityBase(R.layout.activity_confirmar_conta, "Confirmar Conta") {

    private var userId by Delegates.notNull<Int>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        userId = intent.getIntExtra("userId", -1)

    }

    fun reenviarCodigo(_view: android.view.View) {

        reenviarCodigoConfirmacao(userId, this)
    }

    fun enviarCodigo(_view: android.view.View) {

        val codigo = findViewById<android.widget.EditText>(R.id.CodigoConfirmacaoText)

        val codigoText = codigo.text.toString()

        if (codigoText.isEmpty()) {
            Toast.makeText(this, "Preencha o campo código", Toast.LENGTH_SHORT).show()
            codigo.setBackgroundResource(R.drawable.edittext_red_border)

            return
        }

        enviarCodigoConfirmacao(userId, codigoText, this) {
            codigo.setBackgroundResource(R.drawable.edittext_red_border)
            Toast.makeText(this, "Codigo invalido", Toast.LENGTH_SHORT).show()
        }

    }
}