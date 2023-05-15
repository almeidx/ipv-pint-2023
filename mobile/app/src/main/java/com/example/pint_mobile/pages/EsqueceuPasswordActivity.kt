package com.example.pint_mobile.pages

import android.content.Intent
import android.view.View
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class EsqueceuPasswordActivity : ActivityBase(R.layout.activity_esqueceu_password) {
    fun esqueceuPasswordSubmit(_view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }
}
