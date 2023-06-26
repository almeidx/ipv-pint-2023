package com.example.pint_mobile.pages.admin.edit

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.editReuniao
import com.google.android.material.bottomnavigation.BottomNavigationView

class EditarReuniaoActivity : ActivityBase(R.layout.activity_editar_reuniao, "Editar Reunião") {

    private var nome: String? = null
    private var titulo: String? = null
    private var id = 0

    private var negocio = false
    private var candidatura = false
    private lateinit var utilizadores: ArrayList<String>

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
        titulo = intent.getStringExtra("tituloReuniao")

        utilizadores = intent.getStringArrayListExtra("utilizadores") as ArrayList<String>

        Log.i("utilizadores", utilizadores.toString())

        if (negocioReuniao != null) {
            negocio = true
            Log.i("negocio", negocioReuniao)
        }

        if (candidaturaReuniao != null) {
            candidatura = true
            Log.i("candidatura", candidaturaReuniao)
        }


        val data = findViewById<Button>(R.id.DataReuniaoEdit)
        data.text = dataReuniao
        data.isEnabled = false

        val negocioreuniao =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.negocioReuniaoEdit)
        negocioreuniao.setText(negocioReuniao)
        negocioreuniao.isEnabled = false

        val descricao =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.DescricaoReuniaoEdit)
        descricao.setText(descricaoReuniao)

        val nome =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.nomeReuniaoEdit)
        nome.setText(nomeReuniao)

        val candidatura =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.candidaturaReuniaoEdit)
        candidatura.setText(candidaturaReuniao)
        candidatura.isEnabled = false

        val subject =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.subjectReuniaoEdit)
        subject.setText(subjectReuniao)

        val duracao =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.duracaoReuniaoEdit)
        duracao.setText(duracaoReuniao)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true
    }

    fun editarReuniao(view: View) {
        val descricao =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.DescricaoReuniaoEdit).text.toString()
        val nome =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.nomeReuniaoEdit).text.toString()
        val subject =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.subjectReuniaoEdit).text.toString()
        val duracao =
            findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.duracaoReuniaoEdit).text.toString()
                .toInt()

        editReuniao(id, descricao, nome, subject, duracao, this)
    }

    fun criarNota(view: View) {

        if (candidatura) {
            val intent = Intent(this, EditarNotaEntrevistaActivity::class.java)
            intent.putExtra("utilizadores", utilizadores)
            intent.putExtra("Titulo", titulo)
            intent.putExtra("Id", id)
            startActivity(intent)
        } else if (negocio) {
            val intent = Intent(this, EditarNotaEntrevistaActivity::class.java)
            intent.putExtra("utilizadores", utilizadores)
            intent.putExtra("Titulo", titulo)
            intent.putExtra("Id", id)
            startActivity(intent)
        }
    }
}
