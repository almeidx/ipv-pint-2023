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

        nav.menu.findItem(R.id.mais).isChecked = true

        if (user == null) {
            val intent = Intent(this, MainActivity::class.java)
            Toast.makeText(this, "Não tem permissão para aceder a esta página", Toast.LENGTH_SHORT)
                .show()
            startActivity(intent)
            overridePendingTransition(0, 0);
            return
        }
        else{
            adapter = AdminAdapter(this, user.tipoUser)
            adminlink.adapter = adapter
        }

        if (user.tipoUser == TipoUtilizadorEnum.GestorNegocios) {
            adminlink.setOnItemClickListener { _, view, position, _ ->
                if (view.visibility == View.VISIBLE) {
                    when (position) {
                        4 -> {
                            gotoAdminNegocios(view)
                        }
                    }
                }
            }
        }
        else if (user.tipoUser == TipoUtilizadorEnum.Administrador) {
            adminlink.setOnItemClickListener { _, view, position, _ ->
                if (view.visibility == View.VISIBLE) {
                    when (position) {
                        0 -> {
                            gotoAdminBeneficios(view)
                        }

                        1 -> {
                            gotoAdminCandidaturas(view)
                        }

                        2 -> {
                            gotoAdminIdeias(view)
                        }

                        3 -> {
                            gotoAdminMensagens(view)
                        }

                        4 -> {
                            gotoAdminNegocios(view)
                        }

                        5 -> {
                            gotoAdminReporting(view)
                        }

                        6 -> {
                            gotoAdminReunioes(view)
                        }

                        7 -> {
                            gotoAdminUtilizadores(view)
                        }

                        8 -> {
                            gotoAdminVagas(view)
                        }
                    }
                }
            }
        }
    }

    class AdminAdapter(val context: Context, val user: TipoUtilizadorEnum) : BaseAdapter() {
        private val buttons = listOf(
            "Benefícios",
            "Candidaturas",
            "Ideias",
            "Mensagens",
            "Oportunidades",
            "Reporting",
            "Reuniões",
            "Utilizadores",
            "Vagas"
        )

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(parent?.context)
                .inflate(R.layout.item_admin_links, parent, false)
            val botao = view.findViewById<TextView>(R.id.item_admin_link)
            botao.text = buttons[position]

            when (user) {
                TipoUtilizadorEnum.GestorNegocios -> {
                    if (position == 4) {
                        botao.visibility = View.VISIBLE
                    } else {
                        botao.visibility = View.GONE
                    }
                }

                TipoUtilizadorEnum.Administrador -> {
                    if (position == 0 || position == 1 || position == 2 || position == 3 || position == 4 || position == 5 || position == 6 || position == 7 || position == 8) {
                        botao.visibility = View.VISIBLE
                    } else {
                        botao.visibility = View.GONE
                    }
                }

                else -> {
                    botao.visibility = View.GONE
                }
            }
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
}
