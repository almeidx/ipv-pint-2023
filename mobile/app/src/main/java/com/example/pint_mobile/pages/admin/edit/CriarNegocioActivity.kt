package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners

class CriarNegocioActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_criar_negocio)

        setupActivityListeners(window, supportActionBar, this, "Criar Negocio" )
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}