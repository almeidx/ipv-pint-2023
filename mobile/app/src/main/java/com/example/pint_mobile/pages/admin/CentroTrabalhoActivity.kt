package com.example.pint_mobile.pages.admin

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.edit.CriarCentroTrabalhoActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.CentroTrabalho
import com.example.pint_mobile.utils.deleteCentroTrabalho
import com.example.pint_mobile.utils.listarCentrosTrabalho
import com.google.android.material.bottomnavigation.BottomNavigationView

class CentroTrabalhoActivity :
    ActivityBase(R.layout.activity_centro_trabalho, "Administração Centros Trabalho") {
    private val centroTrabalhoList = ArrayList<CentroTrabalho>()
    private val allCentrosTrabalhoList = ArrayList<CentroTrabalho>()
    private lateinit var centroTrabalhoAdapter: CentroTrabalhoAdapterX

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaCentroTrabalho)
        centroTrabalhoAdapter =
            CentroTrabalhoAdapterX(centroTrabalhoList, R.layout.item_centro_trabalho)

        lista.adapter = centroTrabalhoAdapter

        listarCentrosTrabalho(
            centroTrabalhoList,
            allCentrosTrabalhoList,
            centroTrabalhoAdapter,
            this
        )

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class CentroTrabalhoAdapterX(
        private val centro: ArrayList<CentroTrabalho>,
        private val item: Int
    ) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view =
                convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val centroX = centro[position]

            val nome = view.findViewById<TextView>(R.id.titulo_centro_trabalho)
            val info = view.findViewById<TextView>(R.id.info_centro_trabalho)
            val id = view.findViewById<TextView>(R.id.id_centro_trabalho)

            nome.text = centroX.nome
            info.text = centroX.address + ", " + centroX.location + ", " + centroX.postalCode
            id.text = centroX.id.toString()

            view.setOnClickListener {
                deleteCentroTrabalho(centroX.id, view.context)
            }

            return view
        }

        override fun getItem(position: Int): CentroTrabalho {
            return centro[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return centro.size
        }
    }

    fun CriarCentrosTrabalho(view: View) {
        val intent = Intent(this, CriarCentroTrabalhoActivity::class.java)
        startActivity(intent)
    }
}