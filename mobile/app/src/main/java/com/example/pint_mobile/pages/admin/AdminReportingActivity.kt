package com.example.pint_mobile.pages.admin

import android.os.Bundle
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.google.android.material.bottomnavigation.BottomNavigationView

class AdminReportingActivity : ActivityBase(R.layout.activity_admin_reporting, "Reporting") {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

    }
}
