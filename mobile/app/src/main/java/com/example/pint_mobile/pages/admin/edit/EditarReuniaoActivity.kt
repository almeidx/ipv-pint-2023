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
import androidx.appcompat.widget.ButtonBarLayout
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.pad
import com.google.android.material.bottomnavigation.BottomNavigationView

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

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
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
        val btn_timePicker = findViewById<Button>(R.id.dataReuniaoEdit)
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
        val tv_textTime = findViewById<Button>(R.id.dataReuniaoEdit)
        val formattedDateTime = String.format("%04d-%02d-%02dT%02d:%02d:00", savedYear, savedMonth + 1, savedDay, savedHour, savedMinute)
        tv_textTime.setText(formattedDateTime)
    }
}
