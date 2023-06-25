package com.example.pint_mobile

import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatDelegate

import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.getCookieValue
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.getReporting
import com.example.pint_mobile.utils.getUserInfo
import com.facebook.FacebookSdk
import com.facebook.appevents.AppEventsLogger
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.charts.PieChart
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.data.PieData
import com.github.mikephil.charting.data.PieDataSet
import com.github.mikephil.charting.data.PieEntry
import com.github.mikephil.charting.utils.ColorTemplate
import org.json.JSONObject


class MainActivity : ActivityBase(R.layout.activity_main) {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setHomeAsUpIndicator(R.drawable.softinsa_logo)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        window.statusBarColor = getColor(R.color.tudo)
        window.navigationBarColor = getColor(R.color.tudo)

        val pieChart = findViewById<PieChart>(R.id.pieChart)

        pieChart.visibility = PieChart.INVISIBLE

        val cookie = getCookieValue(this)
        if (cookie != null) {
            getUserInfo(cookie, this)
        }

        val user = getCurrentUser(this)

        Toast.makeText(
            this,
            user?.name ?: "Não tem sessão iniciada",
            Toast.LENGTH_LONG
        ).show()

        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)

        FacebookSdk.sdkInitialize(applicationContext)
        AppEventsLogger.activateApp(application)

        getReporting(this) { data ->
            reportingCard(data, "benefícios", R.id.beneficiosX, R.id.beneficiosBtn, "Benefícios: ")

            reportingCard(data, "negócios", R.id.negocios, R.id.negociosBtn, "Negócios: ")

            reportingCard(data, "utilizadores", R.id.utilizadores, R.id.utilizadoresBtn, "Utilizadores: ")

            reportingCard(data,"vagas", R.id.vagas, R.id.vagasBtn, "Vagas: ")

            val vagaData = data.getJSONObject("vagas")



            if (vagaData.has("maisCandidaturas")) {
                val maisCandidaturas = vagaData.getJSONObject("maisCandidaturas")

                val labelsArray = maisCandidaturas.getJSONArray("labels")
                val dataArray = maisCandidaturas.getJSONArray("data")

                val pieEntries = ArrayList<PieEntry>()

                for (i in 0 until labelsArray.length()) {
                    val label = labelsArray.getString(i)
                    val data_ = dataArray.getInt(i).toFloat()
                    pieEntries.add(PieEntry(data_, label))
                }

                val pieDataSet = PieDataSet(pieEntries, "Vagas")
                pieDataSet.setColors(*ColorTemplate.MATERIAL_COLORS)
                pieDataSet.valueTextColor = Color.BLACK
                pieDataSet.valueTextSize = 16f

                val pieData = PieData(pieDataSet)

                pieChart.visibility = PieChart.VISIBLE
                pieChart.data = pieData
                pieChart.description.text = "Vagas com mais candidaturas"
                pieChart.animateY(750)
            }
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    private fun reportingCard(data: JSONObject, key: String, viewId: Int, btnId: Int, prefix: String) {
        val reportingData = data.getJSONObject(key)
        val view = findViewById<TextView>(viewId)
        val btn = findViewById<TextView>(btnId)
        view.text = prefix + reportingData.getInt("total").toString()
        var index = 0

        btn.setOnClickListener {
            index++
            if (index > 3) index = 0

            when (index) {
                0 -> {
                    view.text = prefix + reportingData.getInt("total").toString()
                    btn.text = "Total"
                }
                1 -> {
                    view.text = prefix + reportingData.getInt("today").toString()
                    btn.text = "Hoje"
                }
                2 -> {
                    view.text = prefix + reportingData.getInt("lastWeek").toString()
                    btn.text = "Semanal"
                }
                3 -> {
                    view.text = prefix + reportingData.getInt("lastMonth").toString()
                    btn.text = "Mensal"
                }
            }
        }
    }
}
