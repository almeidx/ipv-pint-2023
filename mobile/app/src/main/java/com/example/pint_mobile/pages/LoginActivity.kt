package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.example.pint_mobile.R

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
    }

    fun login(_view: View) {

    }

    fun loginGoogle(_view: View) {

    }

    fun loginFacebook(_view: View) {

    }

    fun esqueceuPassword(_view: View) {
        val intent = Intent(this, EsqueceuPasswordActivity::class.java)
        startActivity(intent)
    }

    fun aindaNaoTemConta(_view: View) {
        val intent = Intent(this, SignUpActivity::class.java)
        startActivity(intent)
    }
}
