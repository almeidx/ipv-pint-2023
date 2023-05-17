package com.example.pint_mobile

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatDelegate
import com.example.pint_mobile.pages.*
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.getCookieValue
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.getUserInfo

class MainActivity : ActivityBase(R.layout.activity_main, "Softinsa") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        supportActionBar?.setDisplayHomeAsUpEnabled(false)

        val cookie = getCookieValue(this)
        if (cookie != null) {
            getUserInfo(cookie, this)
        }

        val user = getCurrentUser(this)

        Toast.makeText(
            this,
            user?.name ?: "Não tem sessão iniciada",
            Toast.LENGTH_LONG
        ).show()

        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
    }


    fun gotoLogin(_view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdmin(_view: View){
        val intent = Intent(this, AdminActivity::class.java)
        startActivity(intent)
    }

}
