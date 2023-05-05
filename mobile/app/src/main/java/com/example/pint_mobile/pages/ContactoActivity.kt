package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.method.LinkMovementMethod
import android.view.View
import android.widget.TextView
import androidx.core.content.ContextCompat
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.setupActivityListeners

class ContactoActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contacto)

        setupActivityListeners(window, supportActionBar, this, "Contacto", findViewById(R.id.bottombar))

        val t = findViewById<TextView>(R.id.local)
        t.movementMethod = LinkMovementMethod.getInstance()

        val n = findViewById<TextView>(R.id.numerotel)
        n.movementMethod = LinkMovementMethod.getInstance()

        val m = findViewById<TextView>(R.id.mail)
        m.movementMethod = LinkMovementMethod.getInstance()

        window.statusBarColor = ContextCompat.getColor(this, R.color.tudo)
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun enviar(_view: View) {

    }
}
