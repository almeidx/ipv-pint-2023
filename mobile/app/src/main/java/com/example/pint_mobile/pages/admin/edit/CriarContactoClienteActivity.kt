package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class CriarContactoClienteActivity : ActivityBase(R.layout.activity_criar_negocio, "Criar Contacto") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_criar_contacto_cliente)
    }
}