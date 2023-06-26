package com.example.pint_mobile.pages

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.CalendarView
import android.widget.ListView
import android.widget.TextView
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.Evento
import com.example.pint_mobile.utils.formatDateComHoras
import com.example.pint_mobile.utils.listaEventos
import com.example.pint_mobile.utils.pad
import com.google.android.material.bottomnavigation.BottomNavigationView

class CalendarioActivity : ActivityBase(R.layout.activity_calendario, "Calendario") {

    private var calendar: CalendarView? = null
    private var dateView: TextView? = null

    private var data: String = ""

    private val eventosList = ArrayList<Evento>()
    private val allEventsList = ArrayList<Evento>()
    private lateinit var eventosAdapter: EventoAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val nav = findViewById<BottomNavigationView>(R.id.bottombar)

        nav.menu.findItem(R.id.mais).isChecked = true

        val lista = findViewById<ListView>(R.id.listaEventos)

        eventosAdapter = EventoAdapter(eventosList, R.layout.item_evento, data)

        lista.adapter = eventosAdapter

        listaEventos(eventosList, allEventsList, eventosAdapter, applicationContext)

        calendar = findViewById(R.id.calendar)
        dateView = findViewById(R.id.date_view)

        calendar?.setOnDateChangeListener(object : CalendarView.OnDateChangeListener {
            override fun onSelectedDayChange(
                view: CalendarView,
                year: Int,
                month: Int,
                dayOfMonth: Int
            ) {
                val date = "$year-${pad(month + 1)}-${pad(dayOfMonth)}"
                dateView?.text = date

                data = date

                eventosList.clear()

                for (evento in allEventsList) {
                    if (evento.startTime.contains(date)) {
                        eventosList.add(evento)
                    }
                }

                eventosAdapter.notifyDataSetChanged()
            }
        })
    }

    class EventoAdapter(
        private val eventos: ArrayList<Evento>,
        private val item: Int,
        private val data: String
    ) : BaseAdapter() {
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view =
                convertView ?: LayoutInflater.from(parent?.context).inflate(item, parent, false)
            val evento = eventos[position]

            val tituloBeneficio = view.findViewById<TextView>(R.id.titulo_evento)
            val descricaoBeneficio = view.findViewById<TextView>(R.id.description)
            val dataBeneficio = view.findViewById<TextView>(R.id.startTime)
            val duration = view.findViewById<TextView>(R.id.duration)

            tituloBeneficio.text = evento.title + ": " + evento.subject
            descricaoBeneficio.text = evento.description
            dataBeneficio.text = formatDateComHoras(evento.startTime)
            duration.text = "Duração - " + evento.duration.toString() + " minutos"

            return view
        }

        override fun getItem(position: Int): Evento {
            return eventos[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getCount(): Int {
            return eventos.size
        }
    }
}