package com.example.pint_mobile

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatDelegate
import com.example.pint_mobile.pages.*
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.getCookieValue
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.getUserInfo

class MainActivity : ActivityBase(R.layout.activity_main) {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setHomeAsUpIndicator(R.drawable.softinsa_logo)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        window.statusBarColor = getColor(R.color.tudo)
        window.navigationBarColor = getColor(R.color.tudo)

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

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            return true
        }
        return super.onOptionsItemSelected(item)
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
