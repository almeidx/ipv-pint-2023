package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.CheckBox
import android.widget.LinearLayout
import android.widget.TextView
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.deleteCurrentUser
import com.example.pint_mobile.utils.getCurrentUser
import com.google.android.material.bottomnavigation.BottomNavigationView

class PerfilActivity : ActivityBase(R.layout.activity_perfil, "Perfil") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nome = findViewById<TextView>(R.id.nomeUser)
        val email = findViewById<TextView>(R.id.emailUser)
        val user = getCurrentUser(this)
        val pag_admin = findViewById<TextView>(R.id.admin)
        val password = findViewById<TextView>(R.id.password)

        if(user?.tipoUser?.nome == "Administrador"){
            pag_admin.visibility = View.VISIBLE
            pag_admin.setOnClickListener{
                val intent = Intent(this, AdminActivity::class.java)
                startActivity(intent)
                overridePendingTransition(0, 0);
            }
        }

        password.setOnClickListener{
            val intent = Intent(this, MudarPasswordActivity::class.java)
            startActivity(intent)
            overridePendingTransition(0, 0);
        }

        nome.text = user?.name ?: ""
        email.text = user?.email ?: ""
    }

    fun terminarSessao(_view: View) {
        deleteCurrentUser(this)

        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }
}
