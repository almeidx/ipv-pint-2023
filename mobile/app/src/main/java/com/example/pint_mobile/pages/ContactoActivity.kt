package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.method.LinkMovementMethod
import android.view.View
import android.widget.TextView
import com.example.pint_mobile.R

class ContactoActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contacto)

        supportActionBar?.title = "Contacto"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val t = findViewById<TextView>(R.id.local)
        t.movementMethod = LinkMovementMethod.getInstance()

        val n = findViewById<TextView>(R.id.numerotel)
        n.movementMethod = LinkMovementMethod.getInstance()

        val m = findViewById<TextView>(R.id.mail)
        m.movementMethod = LinkMovementMethod.getInstance()
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun enviar(_view: View) {

    }
}
