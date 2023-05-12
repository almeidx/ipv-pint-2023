package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.deleteCurrentUser
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.setupActivityListeners

class PerfilActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_perfil)

        setupActivityListeners(window, supportActionBar, this, "Perfil", findViewById(R.id.bottombar))

        val nome = findViewById<TextView>(R.id.nomeUser)
        val email = findViewById<TextView>(R.id.emailUser)
        val user = getCurrentUser(this)

        nome.text = user?.name ?: ""
        email.text = user?.email ?: ""
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun terminarSessao(_view: View) {
        deleteCurrentUser(this)

        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
    }
    //funcoes para o boneco do perfil

}
