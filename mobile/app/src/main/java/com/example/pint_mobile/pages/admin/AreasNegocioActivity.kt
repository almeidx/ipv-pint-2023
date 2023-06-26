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
import com.example.pint_mobile.pages.admin.edit.CriarAreaNegocioActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.AreaNegocio
import com.example.pint_mobile.utils.deleteAreaNegocio
import com.example.pint_mobile.utils.listaAreas
import com.google.android.material.bottomnavigation.BottomNavigationView

class AreasNegocioActivity :
    ActivityBase(R.layout.activity_areas_negocio, "Administração Areas Negócio") {

    private val areasList = ArrayList<AreaNegocio>()
    private val allAreasList = ArrayList<AreaNegocio>()
    private lateinit var areasAdapter: AreasAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val lista = findViewById<ListView>(R.id.listaAreas)
        areasAdapter = AreasAdapter(areasList, R.layout.item_area_negocio)

        lista.adapter = areasAdapter

        listaAreas(areasList, allAreasList, areasAdapter, this)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    class AreasAdapter(private val areas: ArrayList<AreaNegocio>, private val item: Int) :
        BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view =
                convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val area = areas[position]

            val tituloVaga = view.findViewById<TextView>(R.id.titulo_area)
            val informacoesVaga = view.findViewById<TextView>(R.id.id_area)

            tituloVaga.text = area.nome
            informacoesVaga.text = area.id.toString()

            view.setOnClickListener {
                deleteAreaNegocio(area.id, view.context)
            }

            return view
        }

        override fun getItem(position: Int): AreaNegocio {
            return areas[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return areas.size
        }
    }

    fun CriarAreaNegocio(view: View) {
        val intent = Intent(this, CriarAreaNegocioActivity::class.java)
        startActivity(intent)
    }
}