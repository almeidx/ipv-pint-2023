package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners
import com.google.android.material.textfield.TextInputEditText

class CriarBeneficioActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_criar_beneficio)

        setupActivityListeners(window, supportActionBar, this, "Criar Benefício", findViewById(R.id.bottombar))


    }
}