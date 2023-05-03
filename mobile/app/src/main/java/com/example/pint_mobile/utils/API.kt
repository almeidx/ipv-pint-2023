package com.example.pint_mobile.utils

import android.content.Context
import com.android.volley.Request
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.VagasActivity
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

        fun listaVagas(list: ArrayList<Vaga>, allList: ArrayList<Vaga>, adapter: VagasActivity.VagaAdapter, ctx: Context) {
            val queue = Volley.newRequestQueue(ctx)

            val request = JsonArrayRequest(Request.Method.GET, "https://pint-api.almeidx.dev/vagas", null, { response -> try {
                for (i in 0 until response.length()) {
                    val rawVaga = response.getJSONObject(i)
                    val vaga = Vaga(
                        rawVaga.getString("title"),
                        rawVaga.getString("description"),
                        rawVaga.getBoolean("public"),
                        rawVaga.getInt("amountSlots")
                    )

                    list.add(vaga)
                }

                allList.addAll(list)

                adapter.notifyDataSetChanged()
            } catch (e: JSONException) {
                e.printStackTrace()
            }
            }, { error -> error.printStackTrace() })

            queue.add(request)
        }

        fun listaNegocios(list: ArrayList<Negocio>, allList: ArrayList<Negocio>, adapter: NegociosActivity.NegocioAdapter, ctx: Context) {
            val queue = Volley.newRequestQueue(ctx)

            val request = JsonArrayRequest(Request.Method.GET, "https://pint-api.almeidx.dev/negocios", null, { response -> try {
                for (i in 0 until response.length()) {
                    val rawNegocio = response.getJSONObject(i)
                    val negocio = Negocio(
                        rawNegocio.getString("title"),
                        rawNegocio.getString("description"),
                        rawNegocio.getJSONObject("cliente").getString("name"),
                        rawNegocio.getJSONObject("criador").getString("email"),
                        rawNegocio.getJSONObject("criador").getString("name"),
                        rawNegocio.getJSONObject("areaNegocio").getString("name"),
                        rawNegocio.getJSONObject("funcionarioResponsavel").getString("name"),
                        rawNegocio.getJSONObject("funcionarioResponsavel").getString("email"),
                        rawNegocio.getJSONObject("centroTrabalho").getString("name"),
                        rawNegocio.getJSONObject("centroTrabalho").getString("location"),
                        rawNegocio.getJSONObject("centroTrabalho").getString("postalCode"),
                        rawNegocio.getJSONObject("centroTrabalho").getString("address")
                    )
                    list.add(negocio)
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
