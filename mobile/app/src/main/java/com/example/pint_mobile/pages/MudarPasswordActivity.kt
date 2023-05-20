package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.view.View
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class MudarPasswordActivity : ActivityBase(R.layout.activity_mudar_password) {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        getSupportActionBar()?.hide()
    }
    fun submeterNovaPassword(view: View) {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
    }
}
