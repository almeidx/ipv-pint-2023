package com.example.pint_mobile.pages.admin.edit

import android.annotation.SuppressLint
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.icu.util.Calendar
import android.os.Bundle
import android.widget.Button
import android.widget.DatePicker
import android.widget.EditText
import android.widget.TextView
import android.widget.TimePicker
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase

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

    private var dataReuniao: String? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val id = intent.getStringExtra("idReuniao")
        dataReuniao = intent.getStringExtra("dataReuniao")

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
        val btn_timePicker = findViewById<Button>(R.id.btn_timePicker)
        btn_timePicker.setOnClickListener {
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
        val tv_textTime = findViewById<EditText>(R.id.tv_textTime)
        tv_textTime.setText(dataReuniao)
    }
}
