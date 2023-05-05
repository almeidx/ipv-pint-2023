package com.example.pint_mobile.pages.admin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners

class AdminIdeiasActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_ideias)

        setupActivityListeners(window, supportActionBar, this, "Administração de Ideias", findViewById(R.id.bottombar))
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}