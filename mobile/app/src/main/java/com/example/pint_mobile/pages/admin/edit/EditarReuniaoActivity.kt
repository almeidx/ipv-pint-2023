package com.example.pint_mobile.pages.admin.edit

import android.annotation.SuppressLint
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.icu.util.Calendar
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.DatePicker
import android.widget.EditText
import android.widget.TextView
import android.widget.TimePicker
import androidx.appcompat.widget.ButtonBarLayout
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.editReuniao
import com.example.pint_mobile.utils.pad
import com.google.android.material.bottomnavigation.BottomNavigationView

class EditarReuniaoActivity :  ActivityBase(R.layout.activity_editar_reuniao, "Editar Reunião") {


    private var id = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_reuniao)

         id = intent.getIntExtra("idReuniao", -1)
        val dataReuniao = intent.getStringExtra("dataReuniao")
        val negocioReuniao = intent.getStringExtra("negocioReuniao")
        val descricaoReuniao = intent.getStringExtra("descricaoReuniao")
        val nomeReuniao = intent.getStringExtra("nomeReuniao")
        val candidaturaReuniao = intent.getStringExtra("candidaturaReuniao")
        val subjectReuniao = intent.getStringExtra("subjectReuniao")
        val duracaoReuniao = intent.getStringExtra("duracaoReuniao")

        val data = findViewById<Button>(R.id.DataReuniaoEdit)
        data.text = dataReuniao
        data.isEnabled = false

        val negocioreuniao = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.negocioReuniaoEdit)
        negocioreuniao.setText(negocioReuniao)
        negocioreuniao.isEnabled = false

        val descricao = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.DescricaoReuniaoEdit)
        descricao.setText(descricaoReuniao)

        val nome = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.nomeReuniaoEdit)
        nome.setText(nomeReuniao)

        val candidatura = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.candidaturaReuniaoEdit)
        candidatura.setText(candidaturaReuniao)
        candidatura.isEnabled = false

        val subject = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.subjectReuniaoEdit)
        subject.setText(subjectReuniao)

        val duracao = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.duracaoReuniaoEdit)
        duracao.setText(duracaoReuniao)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun editarReuniao(view: View) {
        val descricao = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.DescricaoReuniaoEdit).text.toString()
        val nome = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.nomeReuniaoEdit).text.toString()
        val subject = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.subjectReuniaoEdit).text.toString()
        val duracao = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.duracaoReuniaoEdit).text.toString().toInt()

        editReuniao(id, descricao, nome, subject, duracao, this)
    }

}
