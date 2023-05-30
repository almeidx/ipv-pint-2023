package com.example.pint_mobile.utils

import android.content.Context
import android.content.Intent
import android.util.Log
import android.widget.Toast
import com.android.volley.NetworkResponse
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.ServerError
import com.android.volley.toolbox.Volley
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.IdeiasActivity
import com.example.pint_mobile.pages.NegocioUtilizadorActivity
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.NotificacoesActivity
import com.example.pint_mobile.pages.VagasActivity
import com.example.pint_mobile.pages.admin.AdminBeneficiosActivity
import com.example.pint_mobile.pages.admin.AdminCandidaturasActivity
import com.example.pint_mobile.pages.admin.AdminIdeiasActivity
import com.example.pint_mobile.pages.admin.AdminMensagensActivity
import com.example.pint_mobile.pages.admin.AdminNegociosActivity
import com.example.pint_mobile.pages.admin.AdminReunioesActivity
import com.example.pint_mobile.pages.admin.AdminUtilizadoresActivity
import com.example.pint_mobile.pages.admin.AdminVagasActivity
import com.example.pint_mobile.pages.admin.edit.AdicionarClienteNegocioActivity
import com.example.pint_mobile.pages.admin.edit.CriarNegocioActivity
import com.example.pint_mobile.pages.admin.edit.EditNegocioActivity
import com.example.pint_mobile.pages.admin.edit.EditarCandidaturaActivity
import com.example.pint_mobile.pages.admin.edit.EditarNotaEntrevistaActivity
import com.example.pint_mobile.pages.admin.edit.SelectContactoClienteNegocioActivity
import com.google.gson.JsonObject
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

// const val API_URL = "http://10.0.2.2:3333"
const val API_URL = "https://pint-api.almeidx.dev"
const val AUTH_PREFERENCE_NAME = "sharedPrefs"

fun listaBeneficios(list: ArrayList<Beneficio>, allList: ArrayList<Beneficio>, adapter: BeneficiosActivity.BeneficioAdapter, ctx: Context, admin: Boolean = false) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET,
        "$API_URL/beneficios${if (admin) "?admin" else ""}", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawBeneficio = response.getJSONObject(i)
            val beneficio = Beneficio(
                rawBeneficio.getString("shortContent"),
                rawBeneficio.getString("content"),
                rawBeneficio.getInt("id"),
                rawBeneficio.getString("dataValidade"),
                rawBeneficio.getString("iconeBeneficio"),
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

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/vagas", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawVaga = response.getJSONObject(i)
            val vaga = Vaga(
                rawVaga.getString("title"),
                rawVaga.getString("description"),
                rawVaga.getBoolean("public"),
                rawVaga.getInt("amountSlots"),
                rawVaga.getInt("id"),
                rawVaga.getInt("status")
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

fun listaNegocios(
    list: ArrayList<Negocio>,
    allList: ArrayList<Negocio>,
    adapter: NegociosActivity.NegocioAdapter,
    ctx: Context,
    admin: Boolean = false
) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(
        ctx,
        Request.Method.GET,
        "$API_URL/negocios${if (admin) "?admin" else ""}",
        null,
        { response ->
            try {
                for (i in 0 until response.length()) {
                    val rawNegocio = response.getJSONObject(i)
                    var funcionarioResponsavel = rawNegocio.optJSONObject("funcionarioResponsavel")
                    var centroTrabalho = rawNegocio.optJSONObject("centroTrabalho")

                    val estadosArray = rawNegocio.getJSONArray("estados")
                    val estadoList = ArrayList<Int>()
                    val dataList = ArrayList<String>()

                    for (j in 0 until estadosArray.length()) {
                        val estadoObj = estadosArray.getJSONObject(j)
                        val estado = estadoObj.getInt("estado")
                        estadoList.add(estado)
                    }

                    for (j in 0 until estadosArray.length()) {
                        val estadoObj = estadosArray.getJSONObject(j)
                        val data = estadoObj.getString("dataFinalizacao")
                        dataList.add(data)
                    }

                    val negocio = Negocio(
                        rawNegocio.getInt("id"),
                        rawNegocio.getString("title"),
                        rawNegocio.getString("description"),
                        rawNegocio.getJSONObject("cliente").getString("name"),
                        rawNegocio.getJSONObject("criador").getString("email"),
                        rawNegocio.getJSONObject("criador").getString("name"),
                        rawNegocio.getJSONObject("areaNegocio").getString("name"),
                        funcionarioResponsavel?.getString("email") ?: "Sem funcionário responsável",
                        funcionarioResponsavel?.getString("name") ?: "Sem funcionário responsável",
                        centroTrabalho?.getString("name") ?: "Sem centro de trabalho",
                        centroTrabalho?.getString("location") ?: "Sem centro de trabalho",
                        centroTrabalho?.getString("postalCode") ?: "Sem centro de trabalho",
                        centroTrabalho?.getString("address") ?: "Sem centro de trabalho",
                        estadoList,
                        dataList
                    )
                    list.add(negocio)
                }
                allList.addAll(list)
                adapter.notifyDataSetChanged()
            } catch (e: JSONException) {
                e.printStackTrace()
            }
        },
        { error -> error.printStackTrace() }
    )
    queue.add(request)
}

fun listaNegociosUser(
    list: ArrayList<NegocioUser>,
    allList: ArrayList<NegocioUser>,
    adapter: NegocioUtilizadorActivity.NegocioAdapter,
    ctx: Context,
) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/negocios", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawNegocio = response.getJSONObject(i)

            val estadosArray = rawNegocio.getJSONArray("estados")
            val estadoList = ArrayList<Int>()
            for (j in 0 until estadosArray.length()) {
                val estadoObj = estadosArray.getJSONObject(j)
                val estado = estadoObj.getInt("estado")
                estadoList.add(estado)
            }

            val negocioUser = NegocioUser(
                rawNegocio.getInt("id"),
                rawNegocio.getString("title"),
                rawNegocio.getString("description"),
                rawNegocio.getJSONObject("areaNegocio").getString("name"),
                rawNegocio.getJSONObject("cliente").getString("name"),
                estadoList
            )
            list.add(negocioUser)
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

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/utilizadores", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawUser = response.getJSONObject(i)
            val tipoUser = rawUser.getJSONObject("tipoUtilizador")
            val user = Utilizador(
                rawUser.getInt("id"),
                rawUser.getString("name"),
                rawUser.getString("email"),
                rawUser.getString("lastLoginDate"),
                TipoUtilizador(
                    tipoUser.getInt("id"),
                    tipoUser.getString("name")
                )
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

fun listaTipoUtilizador(ctx: Context, callback: (ArrayList<TipoUtilizador>) -> Unit) {
    val queue = Volley.newRequestQueue(ctx)
    val tipoUtilizadores = ArrayList<TipoUtilizador>()
    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/tipos-utilizador", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawTipo = response.getJSONObject(i)
            val id = rawTipo.getInt("id")
            val nome = rawTipo.getString("name")
            tipoUtilizadores.add(TipoUtilizador(id, nome))
        }
        callback(tipoUtilizadores)
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })
    queue.add(request)
}

fun listaClientes(list: ArrayList<Cliente>, allList: ArrayList<Cliente>, adapter: AdicionarClienteNegocioActivity.ClienteAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/clientes", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawcliente = response.getJSONObject(i)
            val cliente = Cliente(
                rawcliente.getInt("id"),
                rawcliente.getString("name"),
            )
            list.add(cliente)
        }

        allList.addAll(list)

        adapter.notifyDataSetChanged()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })
    queue.add(request)
}

fun listaContactosCliente(list: ArrayList<Contacto>, allList: ArrayList<Contacto>, adapter: SelectContactoClienteNegocioActivity.ContactosAdapter, ctx: Context, id: Int) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/clientes/$id/contactos", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawContacto = response.getJSONObject(i)
            val contacto = Contacto(
                rawContacto.getInt("idCliente"),
                rawContacto.getString("value"),
                rawContacto.getInt("id"),
            )
            list.add(contacto)
        }

        allList.addAll(list)

        adapter.notifyDataSetChanged()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })
    queue.add(request)
}

fun listarAreasNegocio(list: ArrayList<AreaNegocio>, adapter: CriarNegocioActivity.AreaNegocioAdapter, ctx: Context, callback: () -> Unit) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/areas-de-negocio", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawArea = response.getJSONObject(i)
            val area = AreaNegocio(
                rawArea.getInt("id"),
                rawArea.getString("name"),
            )
            list.add(area)
        }

        adapter.notifyDataSetChanged()
        callback()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })
    queue.add(request)
}

fun listarCentroTrabalho(list: ArrayList<CentroTrabalho>, adapter: EditNegocioActivity.CentroTrabalhoAdapter, ctx: Context, callback: () -> Unit ) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/centros-de-trabalho", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawCentro = response.getJSONObject(i)
            val centro = CentroTrabalho(
                rawCentro.getInt("id"),
                rawCentro.getString("name"),
            )
            list.add(centro)
        }

        adapter.notifyDataSetChanged()
        callback()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })
    queue.add(request)
}

fun listaIdeias(list: ArrayList<Ideia>, allList: ArrayList<Ideia>, adapter: AdminIdeiasActivity.IdeiaAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/ideias", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawIdeia = response.getJSONObject(i)
            val ideia = Ideia(
                rawIdeia.getString("content"),
                rawIdeia.getString("categoria"),
                rawIdeia.getString("dataCriacao"),
                rawIdeia.getJSONObject("utilizador").getString("name"),
                rawIdeia.getInt("id"),
                rawIdeia.getBoolean("ideiaValidada"),
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

fun listaCandidaturas(list: ArrayList<Candidatura>, allList: ArrayList<Candidatura>, adapter: AdminCandidaturasActivity.CandidaturaAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx,Request.Method.GET, "$API_URL/candidaturas", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawCandidatura = response.getJSONObject(i)
            val candidatura = Candidatura(
                rawCandidatura.getInt("id"),
                rawCandidatura.getJSONObject("utilizador").getString("name"),
                rawCandidatura.getJSONObject("vaga").getString("title"),
                rawCandidatura.getJSONObject("vaga").getString("description"),
                rawCandidatura.getString("submissionDate")
            )
            list.add(candidatura)
        }

        allList.addAll(list)
        adapter.notifyDataSetChanged()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })
    queue.add(request)
}

fun listaMensagens(list: ArrayList<Mensagem>, allList: ArrayList<Mensagem>, adapter: AdminMensagensActivity.MensagemAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/mensagens", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawMensagem = response.getJSONObject(i)
            val mensagem = Mensagem(
                rawMensagem.getJSONObject("criador").getString("name"),
                rawMensagem.getString("content"),
                rawMensagem.getString("createdAt"),
                rawMensagem.getBoolean("registered"),
                rawMensagem.getInt("id")
            )
            list.add(mensagem)
        }

        allList.addAll(list)

        adapter.notifyDataSetChanged()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })
    queue.add(request)
}

fun listaReunioes(list: ArrayList<Reuniao>, allList: ArrayList<Reuniao>, adapter: AdminReunioesActivity.ReuniaoAdapter, ctx: Context, admin:Boolean = false) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/reunioes?${if (admin) "admin" else ""}", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawReuniao = response.getJSONObject(i)
            val candidatura = rawReuniao.optJSONObject("candidatura")
            val negocio = rawReuniao.optJSONObject("negocio")


            val reuniao = Reuniao(
                rawReuniao.getString("title"),
                rawReuniao.getString("description"),
                rawReuniao.getString("subject"),
                rawReuniao.getString("startTime"),
                rawReuniao.getString("duration"),
                rawReuniao.getInt("id"),
                candidatura?.getJSONObject("vaga")?.getString("title"),
                negocio?.getString("title"),
            )
            list.add(reuniao)
        }
        allList.addAll(list)
        adapter.notifyDataSetChanged()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })

    queue.add(request)
}

fun listaNotificacoes(list: ArrayList<Notificacao>, adapter: NotificacoesActivity.NotificacaoAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/notificacoes", null,
        { response ->
            for (i in 0 until response.length()) {
                val rawNotificacao = response.getJSONObject(i)
                val notificacao = Notificacao(
                    rawNotificacao.getString("content"),
                    rawNotificacao.getBoolean("seen"),
                    rawNotificacao.getString("createdAt"),
                    rawNotificacao.getInt("type"),
                    if (rawNotificacao.has("additionalDate")) rawNotificacao.getString("additionalDate") else null
                )
                list.add(notificacao)
            }

            adapter.notifyDataSetChanged()
        }, { error -> error.printStackTrace() })

    queue.add(request)
}
fun listarNotasReuniao(
    list: ArrayList<NotaReuniao>,
    allList: ArrayList<NotaReuniao>, adapter: EditarNotaEntrevistaActivity.NotaReuniaoAdapter, id: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonObjectRequestWithCookie(ctx, Request.Method.GET, "$API_URL/reunioes/$id/notas", null,
        { response ->
            val notas = response.getJSONArray("notas")
            for (i in 0 until notas.length()) {
                val rawNota = notas.getJSONObject(i)
                val nota = NotaReuniao(
                    rawNota.getInt("id"),
                    rawNota.getString("content"),
                    rawNota.getString("createdAt")
                )
                list.add(nota)
            }
            adapter.notifyDataSetChanged()
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

fun signup(nome: String, email: String, password: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("name", nome)
    body.put("email", email)
    body.put("password", password)

    val request = object : JsonObjectRequestWithSessionId(Request.Method.POST, "$API_URL/auth/register", body,
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
        }) {
            override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
                val statusCode = response?.statusCode ?: 0
                if (statusCode == 400) {
                    val json = JSONObject(String(response?.data ?: ByteArray(0)))

                    if (json.has("message")) {
                        val message = json.getString("message")
                        Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                    }

                    throw ServerError()
                }

                return super.parseNetworkResponse(response)
            }
        }

    queue.add(request)
}

fun getUserInfo(cookie: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val request = object : JsonObjectRequestWithSessionId(Method.GET, "$API_URL/auth/user", null, Response.Listener { response ->
        val data = response.getJSONObject("data")
        val user = data.getJSONObject("user")

        saveCurrentUser(ctx, user, cookie)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun getHeaders(): MutableMap<String, String> {
            val headers = HashMap<String, String>()
            headers["Cookie"] = getCookie(cookie)
            return headers
        }
    }

    queue.add(request)
}

// delete beneficio
fun deleteBeneficio(id: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.DELETE, "$API_URL/beneficios/$id", null, Response.Listener { response ->
        Toast.makeText(ctx, "Benefício deletado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminBeneficiosActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))
                Log.i("Erro: ", json.toString())
                throw ServerError()
            }
            return super.parseNetworkResponse(response)
        }
    }

    queue.add(request)
}

fun criarBeneficio(titulo: String, descricao: String, icon: String, data:String,  ctx: Context, callback: () -> Unit) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("shortContent", titulo)
    body.put("content", descricao)
    body.put("iconeBeneficio", icon)
    body.put("dataValidade", data)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/beneficios", body, Response.Listener { response ->
        callback()
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }

    }
    queue.add(request)
}

fun editBeneficio(id: Int, titulo: String, descricao: String, icon: String, data:String,  ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("shortContent", titulo)
    body.put("content", descricao)
    body.put("iconeBeneficio", icon)
    body.put("dataValidade", data)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/beneficios/$id", body, Response.Listener { response ->
        Toast.makeText(ctx, "Benefício editado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminBeneficiosActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }

    }
    queue.add(request)
}

fun deleteIdeia(id: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.DELETE, "$API_URL/ideias/$id", null, Response.Listener { response ->
        Toast.makeText(ctx, "Ideia deletada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminIdeiasActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))
                Log.i("Erro: ", json.toString())
                throw ServerError()
            }
            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun editIdeia(id: Int, validacao:Boolean, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("ideiaValidada", validacao)

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/ideias/$id", body, Response.Listener { response ->
        Toast.makeText(ctx, "Ideia editada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminIdeiasActivity::class.java)
        ctx.startActivity(intent)

    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }
                throw ServerError()
            }
            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun createIdea(content: String, categoria: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("content", content)
    body.put("categoria", categoria)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/ideias", body, Response.Listener { response ->
        Toast.makeText(ctx, "Ideia criada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, IdeiasActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }

    }
    queue.add(request)
}

fun apagarMensagem(id: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.DELETE, "$API_URL/mensagens/$id", null, Response.Listener { response ->
        Toast.makeText(ctx, "Mensagem apagada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminMensagensActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))
                Log.i("Erro: ", json.toString())
                throw ServerError()
            }
            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun criarMensagem(nome: String, content: String, email: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("content", content)
    body.put("name", nome)
    body.put("email", email)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/mensagens", body, Response.Listener { response ->
        Toast.makeText(ctx, "Mensagem enviada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, IdeiasActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }

    }
    queue.add(request)
}

fun deleteVaga(id: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.DELETE, "$API_URL/vagas/$id", null, Response.Listener { response ->
        Toast.makeText(ctx, "Vaga apagada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminVagasActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))
                Log.i("Erro: ", json.toString())
                throw ServerError()
            }
            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun editVaga(id: Int, titulo:String, descricao:String, numeroVagas:Int, publico:Boolean, statusInt:Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("title", titulo)
    body.put("description", descricao)
    body.put("amountSlots", numeroVagas)
    body.put("public", publico)
    body.put("status", statusInt)

    Log.i("body", body.toString())
    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/vagas/$id", body, Response.Listener { response ->
        Toast.makeText(ctx, "Vaga editada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminVagasActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }
                throw ServerError()
            }
            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun createVaga(titulo:String, descricao:String, numeroVagas:Int, publico:Boolean,statusInt:Int, icon:String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("title", titulo)
    body.put("description", descricao)
    body.put("amountSlots", numeroVagas)
    body.put("public", publico)
    body.put("status", statusInt)
    body.put("icon", icon)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/vagas", body, Response.Listener { response ->
        Toast.makeText(ctx, "Vaga criada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminVagasActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }

    }
    queue.add(request)
}

fun createReunion(titulo:String, descricao:String, data:String, duracao:Int, userIds:ArrayList<Int>, negocioId: Int?, subject:String, idCandidatura: Int?, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("title", titulo)
    body.put("description", descricao)
    body.put("startTime", data)
    body.put("duration", duracao)
    body.put("subject", subject)
    body.put("utilizadores", JSONArray(userIds))

    if(negocioId != null)
    {
        body.put("idNegocio", negocioId)
    }

    if (idCandidatura != null) {
        body.put("idCandidatura", idCandidatura)
    }

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/reunioes", body, Response.Listener { response ->
        Toast.makeText(ctx, "Reunião criada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminReunioesActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }

    }
    queue.add(request)
}

fun createNegocio(titulo:String, area:Int, descricao:String, cliente: Int, contactos: ArrayList<Int>, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("title", titulo)
    body.put("description", descricao)
    body.put("idCliente", cliente)
    body.put("idAreaNegocio", area)
    body.put("contactos", JSONArray(contactos))

    Log.i("body", body.toString())

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/negocios", body, Response.Listener { response ->
        Toast.makeText(ctx, "Negócio criado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, NegocioUtilizadorActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }

    }
    queue.add(request)
}

fun createClient(nome:String, clienteNome: ArrayList<String> = ArrayList(), clienteIds: ArrayList<Int> = ArrayList() ,ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("name", nome)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/clientes", body, Response.Listener { response ->
        Toast.makeText(ctx, "Cliente criado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdicionarClienteNegocioActivity::class.java)
        intent.putExtra("clienteNome", clienteNome)
        intent.putExtra("clienteIds", clienteIds)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun editNegocio( idNegocio: Int,  estado: JSONArray, centroTrabalhoId:Int, utilizadorId:Int?,  ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("estados", estado)
    body.put("idCentroTrabalho", centroTrabalhoId)
    body.put("idUtilizador", utilizadorId)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/negocios/$idNegocio", body, Response.Listener { response ->
        Toast.makeText(ctx, "Negócio editado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminNegociosActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun editNegocioUser( idNegocio: Int,  titulo: String, descricao: String, area: Int,  ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("title", titulo)
    body.put("description", descricao)
    body.put("idAreaNegocio", area)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/negocios/$idNegocio", body, Response.Listener { response ->
        Toast.makeText(ctx, "Negócio editado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, NegocioUtilizadorActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun createContactoClient(idCliente: Int, type:Int, contacto:String, clientNames: ArrayList<String>, clienteIds: ArrayList<Int>, contactoIds: ArrayList<Int>, contactoNames: ArrayList<String>, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("type", type)
    body.put("value", contacto)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/clientes/$idCliente/contactos", body, Response.Listener { response ->
        Toast.makeText(ctx, "Cliente criado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, SelectContactoClienteNegocioActivity::class.java)
        intent.putExtra("clienteNome", clientNames)
        intent.putExtra("clienteIds", clienteIds)
        intent.putExtra("contactoIds", contactoIds)
        intent.putExtra("contactoNames", contactoNames)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }
    }

    queue.add(request)
}

fun createNotaReuniao(idCandidatura: Int, nota:String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("content", nota)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/reunioes/$idCandidatura/notas", body, Response.Listener { response ->
        Toast.makeText(ctx, "Nota criada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, EditarCandidaturaActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }
    }

    queue.add(request)
}


fun desativarUser(idUser: Int, active: Boolean,  ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("active", active)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/utilizadores/$idUser/disable", body, Response.Listener { response ->
        Toast.makeText(ctx, "Utilizador desativado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminUtilizadoresActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }
    }

    queue.add(request)
}

fun editUser(idUser: Int,  cargo: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("idTipoUser", cargo)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/utilizadores/$idUser", body, Response.Listener { response ->
        Toast.makeText(ctx, "Utilizador editado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminUtilizadoresActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw ServerError()
            }

            return super.parseNetworkResponse(response)
        }
    }

    queue.add(request)
}