package com.example.pint_mobile.pages

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.Admin.AdminBeneficiosActivity
import com.example.pint_mobile.pages.Admin.AdminCandidaturasActivity
import com.example.pint_mobile.pages.Admin.AdminIdeiasActivity
import com.example.pint_mobile.pages.Admin.AdminNegociosActivity
import com.example.pint_mobile.pages.Admin.AdminReportingActivity
import com.example.pint_mobile.pages.Admin.AdminUtilizadoresActivity
import com.example.pint_mobile.pages.Admin.AdminVagasActivity

class Pagina_Admin_Activity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pagina_admin)

        supportActionBar?.title = "Administração"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun onClickAdminReporting(view: android.view.View) {
        val intent = Intent(this, AdminReportingActivity::class.java)
        startActivity(intent)
    }

    fun goToAdminCandidaturas(view: android.view.View) {
        val intent = Intent(this, AdminCandidaturasActivity::class.java)
        startActivity(intent)
    }

    fun goToAdminUtilizador(view: android.view.View) {
        val intent = Intent(this, AdminUtilizadoresActivity::class.java)
        startActivity(intent)
    }

    fun goToAdminVaga(view: android.view.View) {
        val intent = Intent(this, AdminVagasActivity::class.java)
        startActivity(intent)
    }

    fun goToAdminNegocios(view: android.view.View) {
        val intent = Intent(this, AdminNegociosActivity::class.java)
        startActivity(intent)
    }

    fun goToAdminBeneficio(view: android.view.View) {
        val intent = Intent(this, AdminBeneficiosActivity::class.java)
        startActivity(intent)
    }

    fun goToAdminIdeias(view: android.view.View) {
        val intent = Intent(this, AdminIdeiasActivity::class.java)
        startActivity(intent)
    }

}