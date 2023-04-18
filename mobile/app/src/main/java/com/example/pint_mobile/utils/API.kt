package com.example.pint_mobile.utils

import android.content.Context
import com.android.volley.Request
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.pint_mobile.pages.BeneficiosActivity
import org.json.JSONException

class API {
    companion object {
        fun listaBeneficios(list: ArrayList<Beneficio>, allList: ArrayList<Beneficio>, adapter: BeneficiosActivity.BeneficioAdapter, ctx: Context) {
            val queue = Volley.newRequestQueue(ctx)

            val request = JsonArrayRequest(Request.Method.GET, "https://pint-api.almeidx.dev/beneficios", null, { response -> try {
                for (i in 0 until response.length()) {
                    val rawBeneficio = response.getJSONObject(i)
                    val beneficio = Beneficio(
                        rawBeneficio.getString("shortContent"),
                        rawBeneficio.getString("content")
                    )

                    list.add(beneficio)
                }

                allList.addAll(list)

                adapter.notifyDataSetChanged()
            } catch (e: JSONException) {
                e.printStackTrace()
            }
            }, { error -> error.printStackTrace() })

            queue.add(request)
        }
    }
}
