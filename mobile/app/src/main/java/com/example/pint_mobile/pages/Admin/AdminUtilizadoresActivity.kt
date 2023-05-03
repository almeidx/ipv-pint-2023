package com.example.pint_mobile.pages.Admin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R

class AdminUtilizadoresActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_utilizadores)

        supportActionBar?.title = "Utilizadores Administração"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}