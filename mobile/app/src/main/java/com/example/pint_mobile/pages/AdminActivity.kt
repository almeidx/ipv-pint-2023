package com.example.pint_mobile.pages

import android.content.Intent
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.*
import com.example.pint_mobile.utils.ActivityBase

class AdminActivity : ActivityBase(R.layout.activity_admin, "Administração") {
    fun gotoAdminReporting(_view: android.view.View) {
        val intent = Intent(this, AdminReportingActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdminCandidaturas(_view: android.view.View) {
        val intent = Intent(this, AdminCandidaturasActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdminUtilizadores(_view: android.view.View) {
        val intent = Intent(this, AdminUtilizadoresActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdminVagas(_view: android.view.View) {
        val intent = Intent(this, AdminVagasActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdminNegocios(_view: android.view.View) {
        val intent = Intent(this, AdminNegociosActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdminBeneficios(_view: android.view.View) {
        val intent = Intent(this, AdminBeneficiosActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdminIdeias(_view: android.view.View) {
        val intent = Intent(this, AdminIdeiasActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdminMensagens(_view: android.view.View) {
        val intent = Intent(this, AdminMensagensActivity::class.java)
        startActivity(intent)
    }

    fun gotoAdminReunioes(_view: android.view.View) {
        val intent = Intent(this, AdminReunioesActivity::class.java)
        startActivity(intent)
    }
}
