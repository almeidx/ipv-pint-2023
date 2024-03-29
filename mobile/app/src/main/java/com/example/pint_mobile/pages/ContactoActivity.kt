package com.example.pint_mobile.pages

import android.os.Bundle
import android.text.method.LinkMovementMethod
import android.view.View
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.criarMensagem
import com.example.pint_mobile.utils.getCurrentUser
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.textfield.TextInputEditText

class ContactoActivity : ActivityBase(R.layout.activity_contacto, "Contacto") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val t = findViewById<TextView>(R.id.local)
        t.movementMethod = LinkMovementMethod.getInstance()

        val n = findViewById<TextView>(R.id.numerotel)
        n.movementMethod = LinkMovementMethod.getInstance()

        val m = findViewById<TextView>(R.id.mail)
        m.movementMethod = LinkMovementMethod.getInstance()

        // preencher os campos com os dados do utilizador quando estiver logado
        val user = getCurrentUser(this)
        if (user != null) {
            val nome = findViewById<TextInputEditText>(R.id.nomeContactoEnviar)
            val email = findViewById<TextInputEditText>(R.id.emailContactoEnviar)

            nome.setText(user.nome)
            nome.isFocusableInTouchMode = false
            nome.isClickable = false

            email.setText(user.email)
            email.isFocusableInTouchMode = false
            email.isClickable = false
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun enviar(_view: View) {
        val nome = findViewById<TextInputEditText>(R.id.nomeContactoEnviar)
        val email = findViewById<TextInputEditText>(R.id.emailContactoEnviar)
        val assunto = findViewById<TextInputEditText>(R.id.assuntoContactoEnviar)

        val nomeText = nome.text.toString()
        val emailText = email.text.toString()
        val assuntoText = assunto.text.toString()

        //check if fields are empty
        if (nomeText.isEmpty()) {
            nome.background = getDrawable(R.drawable.edittext_red_border)
            Toast.makeText(this, "Nome não pode ser vazio", Toast.LENGTH_SHORT).show()
            return
        } else if (emailText.isEmpty()) {
            email.background = getDrawable(R.drawable.edittext_red_border)
            Toast.makeText(this, "Email não pode ser vazio", Toast.LENGTH_SHORT).show()
            return
        } else if (assuntoText.isEmpty()) {
            assunto.background = getDrawable(R.drawable.edittext_red_border)
            Toast.makeText(this, "Mensagem não pode ser vazia", Toast.LENGTH_SHORT).show()
            return
        }

        criarMensagem(nomeText, assuntoText, emailText, this)
    }
}
