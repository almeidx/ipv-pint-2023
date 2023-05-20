package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.ActionBar
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.getCurrentUser

class EsqueceuPasswordActivity : ActivityBase(R.layout.activity_esqueceu_password) {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        getSupportActionBar()?.hide()
    }

    fun esqueceuPasswordSubmit(_view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }
}
