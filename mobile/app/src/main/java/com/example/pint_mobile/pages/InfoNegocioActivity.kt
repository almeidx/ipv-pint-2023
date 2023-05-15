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
        val criador = intent.getStringExtra("criador")
        val criadorEmail = intent.getStringExtra("criadorEmail")
        val areaNegocio = intent.getStringExtra("areaNegocio")
        val FuncName = intent.getStringExtra("FuncName")
        val FuncEmail = intent.getStringExtra("FuncEmail")
        val centroTrabalhoName = intent.getStringExtra("centroTrabalhoName")
        val centroTrabalhoLocation = intent.getStringExtra("centroTrabalhoLocation")
        val centroTrabalhoPostalCode = intent.getStringExtra("centroTrabalhoPostalCode")
        val centroTrabalhoAdress = intent.getStringExtra("centroTrabalhoAdress")

        // Exibir as informações na TextView
        val tituloTextView = findViewById<TextView>(R.id.titulo)
        tituloTextView.text = titulo

        val descricaoTextView = findViewById<TextView>(R.id.descricao)
        descricaoTextView.text = descricao

        val clienteTextView = findViewById<TextView>(R.id.cliente)
        clienteTextView.text = cliente

        val areaNegocioTextView = findViewById<TextView>(R.id.areadeNegocio)
        areaNegocioTextView.text = areaNegocio

        val criadorTextView = findViewById<TextView>(R.id.criadorName)
        criadorTextView.text = "- $criador"

        val criadorEmailTextView = findViewById<TextView>(R.id.criadorEmail)
        criadorEmailTextView.text = "- $criadorEmail"

        val funcNameTextView = findViewById<TextView>(R.id.FuncName)
        funcNameTextView.text = FuncName

        val funcEmailTextView = findViewById<TextView>(R.id.FuncEmail)
        funcEmailTextView.text = FuncEmail

        val centroTrabalhoNameTextView = findViewById<TextView>(R.id.centroTrabalhoName)
        centroTrabalhoNameTextView.text = centroTrabalhoName

        val centroTrabalhoLocationTextView = findViewById<TextView>(R.id.centroTrabalholocation)
        centroTrabalhoLocationTextView.text = centroTrabalhoLocation

        val centroTrabalhoPostalCodeTextView = findViewById<TextView>(R.id.centroTrabalhopostalCode)
        centroTrabalhoPostalCodeTextView.text = centroTrabalhoPostalCode

        val centroTrabalhoAdressTextView = findViewById<TextView>(R.id.centroTrabalhoaddress)
        centroTrabalhoAdressTextView.text = centroTrabalhoAdress
    }
}
