package com.example.pint_mobile.pages.admin.edit

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.Spinner
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.editNegocio
import com.google.android.material.bottomnavigation.BottomNavigationView
import org.json.JSONArray
import org.json.JSONObject
import java.util.Date
import java.text.SimpleDateFormat
import java.util.Locale

class EditNegocioActivity : ActivityBase(R.layout.activity_edit_negocio, "Editar Negócio") {

    private var idNegocio = 0
    lateinit var estado: String
    private lateinit var getEstado: ArrayList<Int>
    private lateinit var getData: ArrayList<String>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val FuncionarioName = intent.getStringExtra("FuncionarioName")
        val FuncionarioEmail = intent.getStringExtra("FuncionarioEmail")
        val centroTrabalhoName = intent.getStringExtra("centroTrabalhoName")
        val centroTrabalhoLocation = intent.getStringExtra("centroTrabalhoLocation")
        val centroTrabalhoPostalCode = intent.getStringExtra("centroTrabalhoPostalCode")
        val centroTrabalhoAdress = intent.getStringExtra("centroTrabalhoAdress")
        val cliente = intent.getStringExtra("Cliente")
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

        idNegocio = intent.getIntExtra("id", 0)

        val estado = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.estadoDoNegocioEdit)
        estado.setText(items[if (getEstado.size == 0) 0 else getEstado.size - 1])

        val setNextState = findViewById<Button>(R.id.setNextStatex)
        setNextState.setOnClickListener {
            val atual = if (getEstado.size == 0) 0 else getEstado.size

            getEstado.add(atual)

            val formattedDateTime = outputDateTimeFormat.format(currentDate)
            getData.add(formattedDateTime)

            estado.setText(items[atual])

            Log.i("estado", getEstado.toString())
            Log.i("data", getData.toString())
        }

        val clienteEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.clienteNegocioEdit)
        clienteEdit.setText(cliente)
        clienteEdit.isFocusable = false
        clienteEdit.isFocusableInTouchMode = false

        Log.i("idNegocio", idNegocio.toString())

        val centroTrabalhoNameEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.centroTrabalhoNomeNegocioEdit)
        centroTrabalhoNameEdit.setText(centroTrabalhoName)

        val centroTrabalhoLocationEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.centroTrabalhoLocationNegocioEdit)
        centroTrabalhoLocationEdit.setText(centroTrabalhoLocation)

        val centroTrabalhoPostalCodeEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.centroTrabalhopostalCodeNegocioEdit)
        centroTrabalhoPostalCodeEdit.setText(centroTrabalhoPostalCode)

        val centroTrabalhoAdressEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.centroTrabalhoAdressNegocioEdit)
        centroTrabalhoAdressEdit.setText(centroTrabalhoAdress)

        val FuncionarioNameEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.funcionarioDoNegocioEdit)
        FuncionarioNameEdit.setText(FuncionarioName)

        val FuncionarioEmailEdit = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.funcionarioEmailNegocioEdit)
        FuncionarioEmailEdit.setText(FuncionarioEmail)


        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun goToCriarReuniao(view: View) {
        val intent = android.content.Intent(this, com.example.pint_mobile.pages.admin.edit.CriarReuniaoActivity::class.java)
        intent.putExtra("idNegocio", idNegocio)
        startActivity(intent)
    }

    fun editarNegocioX(view: View) {
        val juntaArray = JSONArray()

        for (i in 0 until getEstado.size) {
            val junta = JSONObject()
            junta.put("estado", getEstado[i])
            junta.put("dataFinalizacao", getData[i])
            juntaArray.put(junta)
        }

        editNegocio( idNegocio, juntaArray,  this)
    }

}
