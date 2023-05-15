package com.example.pint_mobile.pages

import android.os.Bundle
import android.text.method.LinkMovementMethod
import android.view.View
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class ContactoActivity : ActivityBase(R.layout.activity_contacto, "Contacto") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val t = findViewById<TextView>(R.id.local)
        t.movementMethod = LinkMovementMethod.getInstance()

        val n = findViewById<TextView>(R.id.numerotel)
        n.movementMethod = LinkMovementMethod.getInstance()

        val m = findViewById<TextView>(R.id.mail)
        m.movementMethod = LinkMovementMethod.getInstance()
    }

    fun enviar(_view: View) {

    }
}
