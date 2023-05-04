package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Toolbar
import androidx.core.content.ContextCompat
import com.example.pint_mobile.R

class EsqueceuPasswordActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_esqueceu_password)

        supportActionBar?.title = "Esqueceu-se da Password"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        window.statusBarColor = ContextCompat.getColor(this, R.color.tudo)
    }
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun AlterarBtn( _view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }
}
