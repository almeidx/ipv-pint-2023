package com.example.pint_mobile.pages

import android.os.Bundle
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class InfoNegocioActivity : ActivityBase(R.layout.activity_info_negocio, "Informação de Negócio") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Receber as informações do negócio enviado pela activity anterior
        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val cliente = intent.getStringExtra("cliente")
        val areaNegocio = intent.getStringExtra("areaNegocio")
    }
}
