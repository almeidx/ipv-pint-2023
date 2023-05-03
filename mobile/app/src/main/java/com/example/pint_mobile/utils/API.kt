package com.example.pint_mobile.utils

import android.content.Context
import android.util.Log
import com.android.volley.NetworkResponse
import com.android.volley.ParseError
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.HttpHeaderParser
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.VagasActivity
import org.json.JSONException
import org.json.JSONObject
import java.io.UnsupportedEncodingException
import java.nio.charset.Charset

const val API_URL = "http://10.0.2.2:3333"
const val PROTOCOL_CHARSET = "utf-8"

class API {
    companion object {
        fun listaBeneficios(list: ArrayList<Beneficio>, allList: ArrayList<Beneficio>, adapter: BeneficiosActivity.BeneficioAdapter, ctx: Context) {
            val queue = Volley.newRequestQueue(ctx)

            val request = JsonArrayRequest(Request.Method.GET,
                "$API_URL/beneficios", null, { response -> try {
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

            val request = JsonArrayRequest(Request.Method.GET, "$API_URL/vagas", null, { response -> try {
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

            val request = JsonArrayRequest(Request.Method.GET, "$API_URL/negocios", null, { response -> try {
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

        fun login(email: String, password: String, ctx: Context) {
            val queue = Volley.newRequestQueue(ctx);

            val body = JSONObject()
            body.put("email", email)
            body.put("password", password)

            val request = CustomJsonObjectRequest(Request.Method.POST, "$API_URL/auth/email", body,
                {
                    response ->
                        val data = response.getJSONObject("data")
                        val user = data.getJSONObject("user")
                        val cookie = response.getString("cookie")

                        val sharedPreferences = ctx.getSharedPreferences("sharedPrefs", Context.MODE_PRIVATE)
                        val editor = sharedPreferences.edit()

                        editor.putString("cookie", cookie)
                        editor.putString("user", user.toString())

                        editor.apply()
                },
                {
                    error -> error.printStackTrace()
                })

            queue.add(request)
        }

        fun getUser(ctx: Context): User? {
            val sharedPreferences = ctx.getSharedPreferences("sharedPrefs", Context.MODE_PRIVATE)
            val user = sharedPreferences.getString("user", null) ?: return null

            val json = JSONObject(user)
            val tipoUtilizador = json.getJSONObject("tipoUtilizador")

            return User(
                json.getInt("id"),
                json.getString("name"),
                json.getString("email"),
                json.getString("lastLoginDate"),
                tipoUtilizador.getInt("id"),
                tipoUtilizador.getString("name")
            )
        }
    }
}

class CustomJsonObjectRequest(
    method: Int,
    url: String?,
    jsonRequest: JSONObject?,
    listener: Response.Listener<JSONObject>,
    errorListener: Response.ErrorListener
) : JsonObjectRequest(method, url, jsonRequest, listener, errorListener) {
    companion object {
        private const val PROTOCOL_CHARSET = "utf-8"
    }

    override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
        try {
            val jsonString = String(response!!.data, Charset.forName(HttpHeaderParser.parseCharset(response.headers, PROTOCOL_CHARSET)))

            val cookies = response.headers?.get("Set-Cookie")

            val regex = Regex("connect.sid=(.*?)(?:;|$)")
            val matchResult = if (cookies != null) regex.find(cookies) else null

            val connectSid = matchResult?.groupValues?.get(1) ?: ""

            val jsonResponse = JSONObject().apply {
                put("data", JSONObject(jsonString))
                put("cookie", connectSid)
            }

            return Response.success(jsonResponse, HttpHeaderParser.parseCacheHeaders(response))
        } catch (e: UnsupportedEncodingException) {
            return Response.error(ParseError(e))
        } catch (je: JSONException) {
            return Response.error(ParseError(je))
        }
    }
}
