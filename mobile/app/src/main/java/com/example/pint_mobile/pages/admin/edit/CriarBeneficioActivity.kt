package com.example.pint_mobile.pages.admin.edit

import android.annotation.SuppressLint
import android.app.Activity
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.icu.util.Calendar
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.telecom.Call
import android.view.View
import android.widget.Button
import android.widget.DatePicker
import android.widget.EditText
import android.widget.TimePicker
import android.widget.Toast
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
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.asRequestBody
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

    private val PICK_IMAGE_REQUEST = 1
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        pickDate()

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

        val btnIcon = findViewById<Button>(R.id.imagePickerX)
        btnIcon.setOnClickListener {
            pickImageFromGallery()
        }
    }

    private fun pickImageFromGallery() {
        val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        startActivityForResult(intent, PICK_IMAGE_REQUEST)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            val imageUri = data.data
            val icon = findViewById<TextInputEditText>(R.id.iconBeneficioEdit)
            icon.setText(imageUri.toString())

            if (imageUri != null) {
                uploadFile(imageUri)
            }
        }
    }

    private fun uploadFile(imageUri: Uri) {

    }

    private fun getRealPathFromURI(uri: Uri): String {
        val projection = arrayOf(MediaStore.Images.Media.DATA)
        val cursor = contentResolver.query(uri, projection, null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val columnIndex = it.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)
                return it.getString(columnIndex)
            }
        }
        return ""
    }

    private fun getDateTimeCalendar() {
        val cal: Calendar = Calendar.getInstance()
        day = cal.get(Calendar.DAY_OF_MONTH)
        month = cal.get(Calendar.MONTH)
        year = cal.get(Calendar.YEAR)
        hour = cal.get(Calendar.HOUR_OF_DAY)  // Use HOUR_OF_DAY instead of HOUR
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
        val tv_textTime = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.dataValidadeBeneficioEdit)
        val formattedDateTime = String.format("%04d-%02d-%02dT%02d:%02d:00", savedYear, savedMonth + 1, savedDay, savedHour, savedMinute)
        tv_textTime.setText(formattedDateTime)
    }


    fun criarBeneficio10(_view: View) {
        val titulo = findViewById<TextInputEditText>(R.id.tituloBeneficioEdit).text.toString()
        val descricao = findViewById<TextInputEditText>(R.id.descricaoBeneficioEdit).text.toString()
        val data = findViewById<TextInputEditText>(R.id.dataValidadeBeneficioEdit).text.toString()
        val icon = findViewById<TextInputEditText>(R.id.iconBeneficioEdit).text.toString()

        var errorMsg: String? = null

        if (titulo.isEmpty()) {
            val titulo = findViewById<EditText>(R.id.tituloBeneficioEdit)
            titulo.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Título não pode ser vazio"
        } else if (descricao.isEmpty()) {
            val descricao = findViewById<EditText>(R.id.descricaoBeneficioEdit)
            descricao.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Descrição não pode ser vazia"
        } else if (icon.isEmpty()) {
            val icon = findViewById<EditText>(R.id.iconBeneficioEdit)
            icon.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Icon não pode ser vazio"
        } else if (data.isEmpty()) {
            val data = findViewById<EditText>(R.id.dataValidadeBeneficioEdit)
            data.setBackgroundResource(R.drawable.edittext_red_border)
            errorMsg = "Data não pode ser vazia"
        }

        if (errorMsg != null) {
            Toast.makeText(this, errorMsg, Toast.LENGTH_LONG).show()
            return
        }

        criarBeneficio(titulo, descricao,icon, data, this) {
            Toast.makeText(this, "Benefício criar com sucesso", Toast.LENGTH_LONG).show()
            val intent = Intent(this, AdminBeneficiosActivity::class.java)
            startActivity(intent)
            overridePendingTransition(0, 0);
        }

    }
}