package com.example.pint_mobile.pages.admin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners

class AdminCandidaturasActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_candidaturas)

        setupActivityListeners(window, supportActionBar, this, "Administração de Candidaturas", findViewById(R.id.bottombar))
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}