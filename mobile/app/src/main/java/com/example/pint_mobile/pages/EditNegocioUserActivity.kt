package com.example.pint_mobile.pages

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.EditText
import android.widget.Spinner
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.edit.CriarNegocioActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.AreaNegocio
import com.example.pint_mobile.utils.CentroTrabalho
import com.example.pint_mobile.utils.editNegocioUser
import com.example.pint_mobile.utils.listarAreasNegocio
import kotlin.properties.Delegates

class EditNegocioUserActivity : ActivityBase(R.layout.activity_edit_negocio_user, "Editar Negócio") {

    var areaNegocioId by Delegates.notNull<Int>()

    private var idNegocio by Delegates.notNull<Int>()
    private var titulo by Delegates.notNull<String>()
    private var descricao by Delegates.notNull<String>()
    private var areaNegocio by Delegates.notNull<String>()
    private lateinit var estadosList: ArrayList<Int>

    private val areasList = ArrayList<AreaNegocio>()
    private lateinit var areasAdapter: CriarNegocioActivity.AreaNegocioAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        idNegocio = intent.getIntExtra("idNegocio", -1)
        titulo = intent.getStringExtra("titulo").toString()
        descricao = intent.getStringExtra("descricao").toString()
        areaNegocio = intent.getStringExtra("areaNegocio").toString()
        estadosList = intent.getIntegerArrayListExtra("estadosList") as ArrayList<Int>

        val ultimoEstado = when (if (estadosList.isNotEmpty()) estadosList.last() else 0) {
            0 -> "Em espera"
            1 -> "A validar"
            2 -> "Em desenvolvimento"
            3 -> "Em conclusão"
            4 -> "Concluído"
            else -> "Cancelado"
        }

        if (estadosList.isNotEmpty()) {
            val button = findViewById<View>(R.id.cancelar)
            button.isEnabled = false

            val tituloEdit = findViewById<EditText>(R.id.tituloDoNegocioEdit)
            tituloEdit.isEnabled = false

            val descricaoEdit = findViewById<EditText>(R.id.descricaoDoNegocioEdit)
            descricaoEdit.isEnabled = false

            val estadosEdit = findViewById<EditText>(R.id.estadoNegocioEdit)
            estadosEdit.isEnabled = false

            val spinner = findViewById<Spinner>(R.id.areadeNegocioUser)
            spinner.isEnabled = false
        } else

        Log.i("estadosList", estadosList.toString())
        Log.i("idNegocio", idNegocio.toString())
        Log.i("titulo", titulo.toString())
        Log.i("descricao", descricao.toString())
        Log.i("areaNegocio", areaNegocio.toString())

        val tituloEdit = findViewById<EditText>(R.id.tituloDoNegocioEdit)
        tituloEdit.setText(titulo)

        val descricaoEdit = findViewById<EditText>(R.id.descricaoDoNegocioEdit)
        descricaoEdit.setText(descricao)

        val estadosEdit = findViewById<EditText>(R.id.estadoNegocioEdit)
        estadosEdit.setText(ultimoEstado)

        val spinner = findViewById<Spinner>(R.id.areadeNegocioUser)

        areasAdapter = CriarNegocioActivity.AreaNegocioAdapter(
            this,
            areasList
        )

        spinner.adapter = areasAdapter

        listarAreasNegocio(
            areasList,
            areasAdapter,
            this
        ) {
            spinner.setSelection(areasList.indexOfFirst { it.nome == areaNegocio })
        }

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedItem = parent.getItemAtPosition(position) as AreaNegocio
                areaNegocioId = selectedItem.id
            }
            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
    }

   fun editarNegocioUser(view: View) {
       val tituloEdit = findViewById<EditText>(R.id.tituloDoNegocioEdit)
       val descricaoEdit = findViewById<EditText>(R.id.descricaoDoNegocioEdit)

       val titulo = tituloEdit.text.toString()
       val descricao = descricaoEdit.text.toString()

       editNegocioUser(
           idNegocio,
           titulo,
           descricao,
           areaNegocioId,
           this
       )
   }
}