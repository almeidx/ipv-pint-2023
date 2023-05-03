package com.example.pint_mobile.pages

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.Spinner
import androidx.core.content.ContextCompat
import com.example.pint_mobile.R

class IdeiasActivity : AppCompatActivity() {
    lateinit var categoria: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ideias)

        window.statusBarColor = ContextCompat.getColor(this, R.color.tudo)

        supportActionBar?.title = "Ideias"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val items = arrayOf(getString(R.string.geral), getString(R.string.estabelecimento), getString(
                    R.string.investimento), getString(R.string.negocio))
        val spinner = findViewById<Spinner>(R.id.categorias)

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, items)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                val selectedItem = parent.getItemAtPosition(position).toString()
                categoria = selectedItem
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    fun criarIdeia(_view: View) {
        val ideia = findViewById<EditText>(R.id.ideiaInput)

        // criar ideia
    }
}
