package com.example.pint_mobile.pages

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.*
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.TipoUtilizadorEnum
import com.example.pint_mobile.utils.getCurrentUser
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminActivity : ActivityBase(R.layout.activity_admin, "Administração") {
    private lateinit var adminlink: ListView
    private lateinit var adapter: AdminAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)
        val user = getCurrentUser(this)
        adminlink = findViewById(R.id.listaAdmin)

        nav.menu.findItem(R.id.mais).isChecked = true

        if (user == null) {
            val intent = Intent(this, MainActivity::class.java)
            Toast.makeText(this, "Não tem permissão para aceder a esta página", Toast.LENGTH_SHORT)
                .show()
            startActivity(intent)
            overridePendingTransition(0, 0);
            return
        } else {
            adapter = AdminAdapter(this, user.tipoUser)
            adminlink.adapter = adapter
        }

        adminlink.setOnItemClickListener { _, view, position, _ ->
            when (adapter.getItem(position)) {
                "Benefícios" -> gotoAdminBeneficios(view)
                "Candidaturas" -> gotoAdminCandidaturas(view)
                "Ideias" -> gotoAdminIdeias(view)
                "Mensagens" -> gotoAdminMensagens(view)
                "Oportunidades" -> gotoAdminNegocios(view)
                "Reporting" -> gotoAdminReporting(view)
                "Reuniões" -> gotoAdminReunioes(view)
                "Utilizadores" -> gotoAdminUtilizadores(view)
                "Vagas" -> gotoAdminVagas(view)
                "Áreas de Negócio" -> gotoAdminAreaNegocio(view)
                "Tipos de Projeto" -> gotoAdminTipoProjeto(view)
            }
        }
    }

    class AdminAdapter(val context: Context, val user: TipoUtilizadorEnum) : BaseAdapter() {
        private val allbuttons = listOf(
            "Benefícios",
            "Candidaturas",
            "Ideias",
            "Mensagens",
            "Oportunidades",
            "Reporting",
            "Reuniões",
            "Utilizadores",
            "Vagas",
            "Áreas de Negócio",
            "Tipos de Projeto"
        )

        private val buttons = when (user) {
            TipoUtilizadorEnum.GestorIdeias -> listOf("Ideias")
            TipoUtilizadorEnum.GestorRecursosHumanos -> listOf("Candidaturas", "Reuniões", "Vagas")
            TipoUtilizadorEnum.GestorNegocios -> listOf("Oportunidades", "Reuniões")
            TipoUtilizadorEnum.GestorConteudos -> listOf("Benefícios", "Mensagens")
            TipoUtilizadorEnum.Administrador -> allbuttons
            else -> emptyList()
        }

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context)
                .inflate(R.layout.item_admin_links, parent, false)
            val botao = view.findViewById<TextView>(R.id.item_admin_link)
            botao.text = buttons[position]
            return view
        }

        override fun getCount(): Int {
            return buttons.size
        }

        override fun getItem(position: Int): Any {
            return buttons[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }
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

    fun gotoAdminAreaNegocio(_view: android.view.View) {

    }

    fun gotoAdminTipoProjeto(_view: android.view.View) {

    }
}
