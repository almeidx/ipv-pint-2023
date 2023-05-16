package com.example.pint_mobile.pages.admin.edit

import android.annotation.SuppressLint
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.icu.util.Calendar
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.DatePicker
import android.widget.EditText
import android.widget.TextView
import android.widget.TimePicker
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

class EditarReuniaoActivity :  ActivityBase(R.layout.activity_editar_reuniao, "Editar Reunião"), DatePickerDialog.OnDateSetListener, TimePickerDialog.OnTimeSetListener {

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

    private var dataReuniao: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_reuniao)

        val id = intent.getIntExtra("idReuniao", 0)
        val dataReuniao = intent.getStringExtra("dataReuniao")
        val negocioReuniao = intent.getStringExtra("negocioReuniao")
        val descricaoReuniao = intent.getStringExtra("descricaoReuniao")
        val nomeReuniao = intent.getStringExtra("nomeReuniao")
        val candidaturaReuniao = intent.getStringExtra("candidaturaReuniao")
        val subjectReuniao = intent.getStringExtra("subjectReuniao")

        val data = findViewById<Button>(R.id.dataReuniaoEdit)
        data.setText(dataReuniao)

        val negocioreuniao = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.negocioReuniaoEdit)
        negocioreuniao.setText(negocioReuniao)

        val descricao = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.DescricaoReuniaoEdit)
        descricao.setText(descricaoReuniao)

        val nome = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.nomeReuniaoEdit)
        nome.setText(nomeReuniao)

        val candidatura = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.candidaturaReuniaoEdit)
        candidatura.setText(candidaturaReuniao)

        val subject = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.subjectReuniaoEdit)
        subject.setText(subjectReuniao)

        pickDate()
    }

    private fun getDateTimeCalendar() {
        val cal: Calendar = Calendar.getInstance()
        day = cal.get(Calendar.DAY_OF_MONTH)
        month = cal.get(Calendar.MONTH)
        year = cal.get(Calendar.YEAR)
        hour = cal.get(Calendar.HOUR)
        minute = cal.get(Calendar.MINUTE)

        dataReuniao = "$day/$month/$year $hour:$minute"
    }



    private fun pickDate() {
        val dataReuniaoEdit = findViewById<Button>(R.id.dataReuniaoEdit)
        dataReuniaoEdit.setOnClickListener {
            getDateTimeCalendar ()
            DatePickerDialog(  this,this, year, month, day). show()
        }
    }

    override fun onDateSet (view: DatePicker?, year: Int, month: Int, dayOfMonth: Int) {
        savedDay = dayOfMonth
        savedMonth = month
        savedYear = year
        getDateTimeCalendar ()
        TimePickerDialog(  this, this, hour, minute, true). show()
    }

    @SuppressLint( "SetTextI18n")
    override fun onTimeSet (view: TimePicker?, hourOfDay: Int, minute: Int) {
        savedHour = hourOfDay
        savedMinute = minute
        val dataReuniaoEdit = findViewById<Button>(R.id.dataReuniaoEdit)
        dataReuniaoEdit.setText(dataReuniao)
    }
}