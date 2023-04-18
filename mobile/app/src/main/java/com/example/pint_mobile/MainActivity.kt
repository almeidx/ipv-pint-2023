package com.example.pint_mobile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.LoginActivity
import com.example.pint_mobile.pages.SignUpActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }

    fun gotoLogin(_view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }

    fun gotoSignUp(_view: View) {
        val intent = Intent(this, SignUpActivity::class.java)
        startActivity(intent)
    }

    fun gotoBeneficios(_view: View) {
        val intent = Intent(this, BeneficiosActivity::class.java)
        startActivity(intent)
    }
}