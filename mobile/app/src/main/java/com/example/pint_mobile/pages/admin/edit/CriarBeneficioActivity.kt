package com.example.pint_mobile.pages.admin.edit

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.icu.util.Calendar
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.telecom.Call
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.DatePicker
import android.widget.EditText
import android.widget.TimePicker
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.admin.AdminBeneficiosActivity
import com.example.pint_mobile.utils.API_URL
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.criarBeneficio
import com.example.pint_mobile.utils.pad
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.textfield.TextInputEditText
import java.io.File
import java.io.IOException
import com.android.volley.Request
import com.android.volley.Response
import com.example.pint_mobile.utils.getCookie
import com.example.pint_mobile.utils.uploadFile
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONObject
import javax.security.auth.callback.Callback


class CriarBeneficioActivity : ActivityBase(R.layout.activity_criar_beneficio, "Criar Benefício"), DatePickerDialog.OnDateSetListener, TimePickerDialog.OnTimeSetListener  {

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
    private var icone: String? = null

    private val PICK_IMAGE_REQUEST = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        pickDate()

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

        val btnIcon = findViewById<Button>(R.id.imagePickerX)
        btnIcon.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, PICK_IMAGE_REQUEST)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            val imageUri = data.data



            val criarBtn = findViewById<Button>(R.id.criarBeneficioBtn)
            criarBtn.isEnabled = false

            uploadFile(this, imageUri!!, true) {
                runOnUiThread {
                    if (it != null) {
                        icone = it

                    } else {
                        Toast.makeText(this, "Erro ao carregar icone", Toast.LENGTH_SHORT).show()
                    }

                    criarBtn.isEnabled = true
                }
            }
        }
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
        val btn_timePicker = findViewById<Button>(R.id.btn_timePicker2)
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
        val tv_textTime = findViewById<TextInputEditText>(R.id.dataValidadeBeneficioEdit)
        val formattedDateTime = String.format("%04d-%02d-%02dT%02d:%02d:00", savedYear, savedMonth + 1, savedDay, savedHour, savedMinute)
        tv_textTime.setText(formattedDateTime)
    }

    fun criarBeneficio10(_view: View) {
        val titulo = findViewById<TextInputEditText>(R.id.tituloBeneficioEdit).text.toString()
        val descricao = findViewById<TextInputEditText>(R.id.descricaoBeneficioEdit).text.toString()
        val data = findViewById<TextInputEditText>(R.id.dataValidadeBeneficioEdit).text.toString()

        var errorMsg: String? = null

        if (titulo.isEmpty()) {
            findViewById<EditText>(R.id.tituloBeneficioEdit).setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Título não pode estar vazio"
        } else if (descricao.isEmpty()) {
            findViewById<EditText>(R.id.descricaoBeneficioEdit).setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Descrição não pode estar vazia"
        } else if (data.isEmpty()) {
            findViewById<EditText>(R.id.dataValidadeBeneficioEdit).setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Data não pode estar vazia"
        }

        if (errorMsg != null) {
            Toast.makeText(this, errorMsg, Toast.LENGTH_LONG).show()
            return
        }

        criarBeneficio(titulo, descricao, icone!!, data, this) {
            Toast.makeText(this, "Benefício criado com sucesso", Toast.LENGTH_LONG).show()
            val intent = Intent(this, AdminBeneficiosActivity::class.java)
            startActivity(intent)
            overridePendingTransition(0, 0);
        }
    }

    fun cancelarBeneficio10(_view: View) {
        val intent = Intent(this, AdminBeneficiosActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }
}
