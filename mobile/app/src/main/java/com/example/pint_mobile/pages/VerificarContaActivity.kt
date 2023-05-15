package com.example.pint_mobile.pages

import android.content.Intent
import android.view.View
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class VerificarContaActivity : ActivityBase(R.layout.activity_verificar_conta) {
    fun submeterCodigo(_view: View) {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
    }

    fun reenviarCodigo() {

    }
}
