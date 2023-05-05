package com.example.pint_mobile.utils

import android.content.Context
import android.content.Intent
import com.android.volley.Request
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.VagasActivity
import com.example.pint_mobile.pages.admin.AdminIdeiasActivity
import com.example.pint_mobile.pages.admin.AdminUtilizadoresActivity
import org.json.JSONException
import org.json.JSONObject

// const val API_URL = "http://10.0.2.2:3333"
const val API_URL = "https://pint-api.almeidx.dev"
const val AUTH_PREFERENCE_NAME = "sharedPrefs"

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

fun listaUtilizadores(list: ArrayList<Utilizador>, allList: ArrayList<Utilizador>, adapter: AdminUtilizadoresActivity.UtilizadorAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequest(Request.Method.GET, "$API_URL/utilizadores", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawUser = response.getJSONObject(i)
            val user = Utilizador(
                rawUser.getInt("id"),
                rawUser.getString("name"),
                rawUser.getString("email"),
                rawUser.getString("lastLoginDate"),
                rawUser.getJSONObject("tipoUtilizador").getInt("id"),
                rawUser.getJSONObject("tipoUtilizador").getString("name")
            )
            list.add(user)
        }
        allList.addAll(list)
        adapter.notifyDataSetChanged()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })
    queue.add(request)
}

fun listaIdeias(list: ArrayList<Ideia>, allList: ArrayList<Ideia>, adapter: AdminIdeiasActivity.IdeiaAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequest(Request.Method.GET, "$API_URL/ideias", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawIdeia = response.getJSONObject(i)
            val ideia = Ideia(
                rawIdeia.getString("content"),
                rawIdeia.getString("categoria"),
                rawIdeia.getString("dataCriacao"),
                rawIdeia.getJSONObject("utilizador").getString("name")
            )
            list.add(ideia)
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

    val request = JsonObjectRequestWithSessionId(Request.Method.POST, "$API_URL/auth/email", body,
        { response ->
            val cookie = response.getString("cookie")
            val data = response.getJSONObject("data")
            val user = data.getJSONObject("user")

            saveCurrentUser(ctx, user, cookie)

            val intent = Intent(ctx, MainActivity::class.java)
            ctx.startActivity(intent)
        },
        { error ->
            error.printStackTrace()
        })

    queue.add(request)
}
