package com.example.pint_mobile

import android.graphics.Color
import android.os.Bundle
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.AppCompatDelegate

import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.getCookieValue
import com.example.pint_mobile.utils.getCurrentUser
import com.example.pint_mobile.utils.getUserInfo
import com.facebook.FacebookSdk
import com.facebook.appevents.AppEventsLogger
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.utils.ColorTemplate


class MainActivity : ActivityBase(R.layout.activity_main) {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setHomeAsUpIndicator(R.drawable.softinsa_logo)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        window.statusBarColor = getColor(R.color.tudo)
        window.navigationBarColor = getColor(R.color.tudo)

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

        val barChart = findViewById<BarChart>(R.id.barChart2)

        val visitors = ArrayList<BarEntry>()
        visitors.add(BarEntry(1f, 420f))
        visitors.add(BarEntry(2f, 475f))
        visitors.add(BarEntry(3f, 1508f))
        visitors.add(BarEntry(4f, 660f))
        visitors.add(BarEntry(5f, 550f))

        val barDataSet = BarDataSet(visitors, "Visitors")
        barDataSet.setColors(*ColorTemplate.MATERIAL_COLORS)
        barDataSet.valueTextColor = Color.BLACK
        barDataSet.valueTextSize = 16f

        val barData = BarData(barDataSet)

        barChart.data = barData
        barChart.animateY(2000)

        FacebookSdk.sdkInitialize(getApplicationContext())
        AppEventsLogger.activateApp(this)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            return true
        }
        return super.onOptionsItemSelected(item)
    }
}
