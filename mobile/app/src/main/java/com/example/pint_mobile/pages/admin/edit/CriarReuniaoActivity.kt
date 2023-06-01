package com.example.pint_mobile.pages.admin.edit

import android.annotation.SuppressLint
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.icu.util.Calendar
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.DatePicker
import android.widget.EditText
import android.widget.TextView
import android.widget.TimePicker
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.LoginActivity
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.createReunion
import com.example.pint_mobile.utils.pad
import com.google.android.material.bottomnavigation.BottomNavigationView

class CriarReuniaoActivity : ActivityBase(R.layout.activity_criar_reuniao, "Criar Reunião"), DatePickerDialog.OnDateSetListener, TimePickerDialog.OnTimeSetListener {

    var month = 0
    var day = 0
    var year = 0
    var hour = 0
    var minute = 0

    var savedDay = 0
    var savedMonth = 0
    var savedYear = 0
    var savedHour = 0
    var savedMinute = 0


    private lateinit var userNames: ArrayList<String>
    private lateinit var data: ArrayList<String>
    private lateinit var userIds: ArrayList<Int>
    private lateinit var negocioId: ArrayList<Int>
    private lateinit var candidaturaId: ArrayList<Int>

    private var dataReuniao: String? = null
    private var getidNegocio = 0
    private var getidCandidatura = 0

    @SuppressLint("SetTextI18n")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val id = intent.getStringExtra("idReuniao")
        dataReuniao = intent.getStringExtra("dataReuniao")

        getidCandidatura = intent.getIntExtra("idCandidatura", -1)
        getidNegocio = intent.getIntExtra("idNegocio", -1)
        userNames = intent.getStringArrayListExtra("users") ?: ArrayList()
        userIds = intent.getIntegerArrayListExtra("userIds") ?: ArrayList()
        negocioId = intent.getIntegerArrayListExtra("negocioId") ?: ArrayList()
        candidaturaId = intent.getIntegerArrayListExtra("candidaturaId") ?: ArrayList()
        data = intent.getStringArrayListExtra("data") ?: ArrayList()

        if(getidNegocio != -1){
            negocioId.add(getidNegocio)
        }

        if (getidCandidatura != -1){
            candidaturaId.add(getidCandidatura)
        }

        Log.i("candidaturaId", candidaturaId.toString())
        Log.i("negocioId", negocioId.toString())
        Log.i("data", data.toString())
        Log.i("users", userNames.toString())
        Log.i("users", userIds.toString())

        if( data.size > 1) {
            data.last().let {
                dataReuniao = it
            }
        }

        val setUser = findViewById<TextView>(R.id.usersReuniaoEditText)

            val usersText = userNames.joinToString(", ")
            setUser.text =  usersText

        pickDate()

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

        val tv_textTime = findViewById<EditText>(R.id.tv_textTime)
        if (dataReuniao != null) tv_textTime.setText(dataReuniao)
        else tv_textTime.setText("Data e Hora")
    }
    private fun getDateTimeCalendar() {
        val cal: Calendar = Calendar.getInstance()
        day = cal.get(Calendar.DAY_OF_MONTH)
        month = cal.get(Calendar.MONTH)
        year = cal.get(Calendar.YEAR)
        hour = cal.get(Calendar.HOUR_OF_DAY)
        minute = cal.get(Calendar.MINUTE)


        dataReuniao = "$year-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00"
    }

    private fun pickDate() {
        val btn_timePicker = findViewById<Button>(R.id.btn_timePicker)
        btn_timePicker.setOnClickListener {
            DatePickerDialog(this, this, year, month, day).show()
        }
    }

    override fun onDateSet(view: DatePicker?, year: Int, month: Int, dayOfMonth: Int) {
        savedDay = dayOfMonth
        savedMonth = month
        savedYear = year
        getDateTimeCalendar()
        TimePickerDialog(this, this, hour, minute, true).show()
    }

    @SuppressLint("SetTextI18n")
    override fun onTimeSet(view: TimePicker?, hourOfDay: Int, minute: Int) {
        savedHour = hourOfDay
        savedMinute = minute
        val tv_textTime = findViewById<EditText>(R.id.tv_textTime)
        val formattedDateTime = String.format("%04d-%02d-%02dT%02d:%02d:00", savedYear, savedMonth + 1, savedDay, savedHour, savedMinute)
        tv_textTime.setText(formattedDateTime)

        dataReuniao = formattedDateTime
        data.add(dataReuniao!!)
    }

    fun selectUsers(_view: View) {
        val intent = Intent(this, SelectUserActivity::class.java)

        intent.putExtra("users", userNames)
        intent.putExtra("userIds", userIds)
        intent.putExtra("negocioId", negocioId)
        intent.putExtra("candidaturaId", candidaturaId)
        intent.putExtra("data", data)

       Log.i("negocioId", negocioId.toString())
       Log.i("candidaturaId", candidaturaId.toString())
       Log.i("data", data.toString())

        startActivity(intent)
        overridePendingTransition(0, 0);
    }

    fun criarReuniao(_view: View) {

        val titulo = findViewById<EditText>(R.id.titulo_reuniao).text.toString()
        val duracao = findViewById<EditText>(R.id.duracaoReuniaoEditText).text.toString().toInt()
        val data = findViewById<EditText>(R.id.tv_textTime).text.toString()
        val descricao = findViewById<EditText>(R.id.descricao_reuniao).text.toString()
        val subjetc = findViewById<EditText>(R.id.subjectReuniaoEditText).text.toString()

        Log.i("negocioId", negocioId.toString())

        getidCandidatura = candidaturaId.last()

        Log.i("getidCandidatura", getidCandidatura.toString())

        createReunion( titulo, descricao, data, duracao,  userIds, getidNegocio, subjetc, getidCandidatura,  this)

    }
}
