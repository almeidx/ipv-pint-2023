package com.example.pint_mobile.pages.admin.edit

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.BaseAdapter
import android.widget.EditText
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.AdminUtilizadoresActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Utilizador
import com.example.pint_mobile.utils.listaUtilizadores
import com.google.android.material.bottomnavigation.BottomNavigationView

class SelectUserActivity : ActivityBase(R.layout.activity_select_user, "Escolher Utilizadores") {

    private val utilizadoresList = ArrayList<Utilizador>()
    private val allUtilizadoresList = ArrayList<Utilizador>()
    private lateinit var utilizadoresAdapter: AdminUtilizadoresActivity.UtilizadorAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaUtilizador2)
        utilizadoresAdapter = AdminUtilizadoresActivity.UtilizadorAdapter(
            utilizadoresList,
            R.layout.item_utilizadores,
            true,
            intent.getStringArrayListExtra("users")!!,
            intent.getIntegerArrayListExtra("userIds")!!,
            intent.getIntegerArrayListExtra("negocioId")!!,
            intent.getIntegerArrayListExtra("candidaturaId")!!,
            intent.getStringArrayListExtra("data")!!
        )


        lista.adapter = utilizadoresAdapter

        listaUtilizadores(utilizadoresList, allUtilizadoresList, utilizadoresAdapter, this)

        val search = findViewById<EditText>(R.id.pesquisa2)
        search.setOnEditorActionListener { _, actionId, event ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {

                utilizadoresList.clear()

                for (user in allUtilizadoresList) {
                    if (user.compareToString(search.text.toString())) {
                        utilizadoresList.add(user)
                    }
                }

                utilizadoresAdapter.notifyDataSetChanged()

                true
            } else {
                false
            }
        }
        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }
}