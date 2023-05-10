package com.example.pint_mobile.pages.admin.edit

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners

class CriarReuniaoActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_criar_reuniao)

        setupActivityListeners(window, supportActionBar, this, "Criar Reunião", findViewById(R.id.bottombar))
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}