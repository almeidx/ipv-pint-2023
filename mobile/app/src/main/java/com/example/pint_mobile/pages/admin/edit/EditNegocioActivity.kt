package com.example.pint_mobile.pages.admin.edit

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.BaseAdapter
import android.widget.Button
import android.widget.Spinner
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.AreaNegocio
import com.example.pint_mobile.utils.CentroTrabalho
import com.example.pint_mobile.utils.editNegocio
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.listarCentroTrabalho
import com.google.android.material.bottomnavigation.BottomNavigationView
import org.json.JSONArray
import org.json.JSONObject
import java.util.Date
import java.text.SimpleDateFormat
import java.util.Locale
import kotlin.properties.Delegates

class EditNegocioActivity : ActivityBase(R.layout.activity_edit_negocio, "Editar Negócio") {

    private var idNegocio = 0
    lateinit var estado: String
    private lateinit var getEstado: ArrayList<Int>
    private lateinit var getData: ArrayList<String>
    var centroTrabalhoId by Delegates.notNull<Int>()

    private val centroTrabalhoList = ArrayList<CentroTrabalho>()
    private lateinit var centroTrabalhoAdapter: CentroTrabalhoAdapter
    private var utilizadorId: Int? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val centroTrabalhoName = intent.getStringExtra("centroTrabalho")
        val funcResponsavel = intent.getStringExtra("funcResponsavel")

        val funcionarioResponsavel = findViewById<TextView>(R.id.FuncionarioResponsavelNegocioEdit)
        funcionarioResponsavel.text = funcResponsavel

        Log.i("centroTrabalhoName", centroTrabalhoName.toString())

        val spinner = findViewById<Spinner>(R.id.centroTrabalhoNegocio)

        centroTrabalhoAdapter = CentroTrabalhoAdapter(
            this,
            centroTrabalhoList
        )

        spinner.adapter = centroTrabalhoAdapter

        listarCentroTrabalho(
            centroTrabalhoList,
            centroTrabalhoAdapter,
            this
        ) {
            spinner.setSelection(centroTrabalhoList.indexOfFirst { it.nome == centroTrabalhoName })
        }


        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedItem = parent.getItemAtPosition(position) as CentroTrabalho
                centroTrabalhoId = selectedItem.id
            }
            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        val setFuncionario = findViewById<Button>(R.id.setFuncionarioNegocio)
        setFuncionario.setOnClickListener {
            val user = getCurrentUser(this)
            utilizadorId = user?.id!!


            funcionarioResponsavel.text = user?.name
        }

        getEstado = intent.getIntegerArrayListExtra("estado")!!
        getData = intent.getStringArrayListExtra("data")!!

        getEstado.sort()
        val outputDateTimeFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault())
        val currentDate = Date()

        Log.i("estado", getEstado.toString())
        Log.i("data", getData.toString())

        val items = arrayOf(
            "Em espera",
            "Em análise",
            "Em desenvolvimento",
            "Em finalização",
            "Concluído"
        )

        idNegocio = intent.getIntExtra("id", -1)

        val estado = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.estadoDoNegocioEdit)
        estado.setText(items[if (getEstado.size == 0) 0 else getEstado.size - 1])

        val setNextState = findViewById<Button>(R.id.setNextStatex)
        setNextState.setOnClickListener {
            val atual = if (getEstado.size == 0) 0 else getEstado.size

            if (atual == 5){
                return@setOnClickListener
            }else
            {
                getEstado.add(atual)
            }


            val formattedDateTime = outputDateTimeFormat.format(currentDate)
            getData.add(formattedDateTime)

            estado.setText(items[atual])

            Log.i("estado", getEstado.toString())
            Log.i("data", getData.toString())
        }

        Log.i("idNegocio", idNegocio.toString())
    }

    class CentroTrabalhoAdapter(val context: Context, val dataSource: ArrayList<CentroTrabalho>) :
        BaseAdapter() {

        private val inflater: LayoutInflater =
            context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater

        override fun getCount(): Int {
            return dataSource.size
        }

        override fun getItem(position: Int): Any {
            return dataSource[position]
        }

        override fun getItemId(position: Int): Long {
            val centroTrabalho = getItem(position) as CentroTrabalho
            return centroTrabalho.id.toLong()
        }

        override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
            val rowView = inflater.inflate(androidx.appcompat.R.layout.support_simple_spinner_dropdown_item, parent, false)

            val centroTrabalho = getItem(position) as CentroTrabalho

            val nomeCentro = rowView.findViewById<TextView>(android.R.id.text1)

            nomeCentro.text = centroTrabalho.nome

            return rowView
        }
    }

    fun goToCriarReuniao(view: View) {
        val intent = android.content.Intent(this, com.example.pint_mobile.pages.admin.edit.CriarReuniaoActivity::class.java)
        intent.putExtra("idNegocio", idNegocio)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun editarNegocioX(view: View) {
        val juntaArray = JSONArray()

        for (i in 0 until getEstado.size) {
            val junta = JSONObject()
            junta.put("estado", getEstado[i])
            junta.put("dataFinalizacao", getData[i])
            juntaArray.put(junta)
        }

        Log.i("idNegocio", idNegocio.toString())
        Log.i("juntaArray", juntaArray.toString())
        Log.i("centroTrabalhoId", centroTrabalhoId.toString())
        Log.i("utilizadorId", utilizadorId?.toString() ?: "nada")

        editNegocio( idNegocio, juntaArray, centroTrabalhoId, utilizadorId,  this)
    }

}
