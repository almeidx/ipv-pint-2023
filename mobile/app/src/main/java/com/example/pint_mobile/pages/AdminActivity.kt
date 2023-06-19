package com.example.pint_mobile.pages

import android.content.Context
import android.content.Intent
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.*
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.getCurrentUser
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminActivity : ActivityBase(R.layout.activity_admin, "Administração") {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

    }

    fun gotoAdminReporting(_view: android.view.View) {
        val intent = Intent(this, AdminReportingActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun gotoAdminCandidaturas(_view: android.view.View) {
        val intent = Intent(this, AdminCandidaturasActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun gotoAdminUtilizadores(_view: android.view.View) {
        val intent = Intent(this, AdminUtilizadoresActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun gotoAdminVagas(_view: android.view.View) {
        val intent = Intent(this, AdminVagasActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun gotoAdminNegocios(_view: android.view.View) {
        val intent = Intent(this, AdminNegociosActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun gotoAdminBeneficios(_view: android.view.View) {
        val intent = Intent(this, AdminBeneficiosActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun gotoAdminIdeias(_view: android.view.View) {
        val intent = Intent(this, AdminIdeiasActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun gotoAdminMensagens(_view: android.view.View) {
        val intent = Intent(this, AdminMensagensActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun gotoAdminReunioes(_view: android.view.View) {
        val intent = Intent(this, AdminReunioesActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);

    }
}
