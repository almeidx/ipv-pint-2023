package com.example.pint_mobile.pages

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.TipoUtilizadorEnum
import com.example.pint_mobile.utils.Utilizador
import com.example.pint_mobile.utils.editarUtilizador
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.uploadFile
import kotlin.properties.Delegates

class InfoVagaActivity : ActivityBase(R.layout.activity_info_vaga, "Informação da Vaga") {

    private var id by Delegates.notNull<Int>()
    private var user: Utilizador? = null

    private var idVaga by Delegates.notNull<Int>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        user = getCurrentUser(this)
        id = user?.id ?: -1

        val VagaInscricao = findViewById<Button>(R.id.VagaInscricao)


        val titulo = intent.getStringExtra("titulo")
        val descricao = intent.getStringExtra("descricao")
        val publico = intent.getStringExtra("publico")
        val slots = intent.getStringExtra("slots")
        idVaga = intent.getIntExtra("id", -1)

        val tituloTextView = findViewById<TextView>(R.id.titulo)
        tituloTextView.text = titulo

        val descricaoTextView = findViewById<TextView>(R.id.descricao)
        descricaoTextView.text = descricao

        val publicoTextView = findViewById<TextView>(R.id.publico)
        publicoTextView.text = publico

        val slotsTextView = findViewById<TextView>(R.id.slots)
        slotsTextView.text = slots


        VagaInscricao.setOnClickListener {
            if ( user == null ){
                Toast.makeText(this, "Inicie sessão para se candidatar.", Toast.LENGTH_SHORT).show()
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
                overridePendingTransition(0, 0);
            }
            else{
                val intent = Intent(this, RefEmailVagaActivity::class.java)
                intent.putExtra("idVaga", idVaga)
                startActivity(intent)
            }
        }
    }


}
