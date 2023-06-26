package com.example.pint_mobile.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.MediaStore
import android.provider.OpenableColumns
import android.util.Log
import android.widget.EditText
import android.widget.Toast
import com.android.volley.AuthFailureError
import com.android.volley.NetworkResponse
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.ServerError
import com.android.volley.toolbox.Volley
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.pages.AdminActivity
import com.example.pint_mobile.pages.BeneficiosActivity
import com.example.pint_mobile.pages.CalendarioActivity
import com.example.pint_mobile.pages.ConfirmarContaActivity
import com.example.pint_mobile.pages.IdeiasActivity
import com.example.pint_mobile.pages.LoginActivity
import com.example.pint_mobile.pages.NegocioUtilizadorActivity
import com.example.pint_mobile.pages.NegociosActivity
import com.example.pint_mobile.pages.NotificacoesActivity
import com.example.pint_mobile.pages.PerfilActivity
import com.example.pint_mobile.pages.VagasActivity
import com.example.pint_mobile.pages.VagasCandidatadasActivity
import com.example.pint_mobile.pages.admin.AdminBeneficiosActivity
import com.example.pint_mobile.pages.admin.AdminCandidaturasActivity
import com.example.pint_mobile.pages.admin.AdminIdeiasActivity
import com.example.pint_mobile.pages.admin.AdminMensagensActivity
import com.example.pint_mobile.pages.admin.AdminNegociosActivity
import com.example.pint_mobile.pages.admin.AdminReunioesActivity
import com.example.pint_mobile.pages.admin.AdminTiposProjetoActivity
import com.example.pint_mobile.pages.admin.AdminUtilizadoresActivity
import com.example.pint_mobile.pages.admin.AdminVagasActivity
import com.example.pint_mobile.pages.admin.AreasNegocioActivity
import com.example.pint_mobile.pages.admin.CentroTrabalhoActivity
import com.example.pint_mobile.pages.admin.edit.AdicionarClienteNegocioActivity
import com.example.pint_mobile.pages.admin.edit.CriarNegocioActivity
import com.example.pint_mobile.pages.admin.edit.EditNegocioActivity
import com.example.pint_mobile.pages.admin.edit.EditarNotaEntrevistaActivity
import com.example.pint_mobile.pages.admin.edit.EditarReuniaoActivity
import com.example.pint_mobile.pages.admin.edit.SelectContactoClienteNegocioActivity
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.util.Calendar
import javax.security.auth.callback.Callback

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
fun listarVagasUser(list: ArrayList<vagaCandidatada>, allList: ArrayList<vagaCandidatada>, adapter: VagasCandidatadasActivity.VagaCandidatadaAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/candidaturas", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawVaga = response.getJSONObject(i)
            val vaga = vagaCandidatada(
                rawVaga.getString("submissionDate"),
                rawVaga.getJSONObject("vaga").getString("title"),
                rawVaga.getJSONObject("vaga").getString("description"),
                rawVaga.getJSONObject("vaga").getInt("amountSlots"),
                rawVaga.getJSONObject("vaga").getInt("id"),
                rawVaga.getJSONObject("vaga").getInt("status"),
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

fun listaVagas(list: ArrayList<Vaga>, allList: ArrayList<Vaga>, adapter: VagasActivity.VagaAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/vagas?admin", null, { response -> try {
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

fun listaAreas(list: ArrayList<AreaNegocio>, allList: ArrayList<AreaNegocio>, adapter: AreasNegocioActivity.AreasAdapter, ctx: Context) {
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
        allList.addAll(list)
        adapter.notifyDataSetChanged()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })

    queue.add(request)
}

fun listaTipoProjeto(list: ArrayList<TipoProjeto>, allList: ArrayList<TipoProjeto>, adapter: AdminTiposProjetoActivity.ProjetosAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/tipos-projeto", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawTipoProjeto = response.getJSONObject(i)
            val tipoProjeto = TipoProjeto(
                rawTipoProjeto.getInt("id"),
                rawTipoProjeto.getString("name"),
            )
            list.add(tipoProjeto)
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
                        dataList,
                        rawNegocio.getString("createdAt")
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

            val necessidadesArray = rawNegocio.getJSONArray("necessidades")
            val necessidadesList = ArrayList<String>()
            for (j in 0 until necessidadesArray.length()) {
                val necessidadeObj = necessidadesArray.getJSONObject(j)
                val necessidade = necessidadeObj.getString("name")
                necessidadesList.add(necessidade)
            }

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
                estadoList,
                necessidadesList
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
                GetTipoUser(tipoUser.getInt("id")),
                rawUser.getBoolean("disabled")
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

fun GetTipoUser(id: Int) : TipoUtilizadorEnum{
    return when (id) {
        1 -> TipoUtilizadorEnum.Utilizador
        2 -> TipoUtilizadorEnum.GestorIdeias
        3 -> TipoUtilizadorEnum.GestorRecursosHumanos
        4 -> TipoUtilizadorEnum.GestorNegocios
        5 -> TipoUtilizadorEnum.GestorConteudos
        6 -> TipoUtilizadorEnum.Administrador
        7 -> TipoUtilizadorEnum.Colaborador
        else -> throw IllegalArgumentException("Invalid id")
    }
}

fun listaTipoUtilizador(ctx: Context, callback: (ArrayList<TipoUtilizadorEnum>) -> Unit) {
    val queue = Volley.newRequestQueue(ctx)
    val tipoUtilizadores = ArrayList<TipoUtilizadorEnum>()
    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/tipos-utilizador", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawTipo = response.getJSONObject(i)
            val id = rawTipo.getInt("id")
            val nome = rawTipo.getString("name")
            tipoUtilizadores.add(GetTipoUser(id))
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

fun listarTiposProjeto(list: ArrayList<TipoProjeto>, adapter: CriarNegocioActivity.TipoProjetoAdapter, ctx: Context, callback: () -> Unit) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/tipos-projeto", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawTipo = response.getJSONObject(i)
            val tipo = TipoProjeto(
                rawTipo.getInt("id"),
                rawTipo.getString("name"),
            )
            list.add(tipo)
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
                rawCentro.getString("address"),
                rawCentro.getString("location"),
                rawCentro.getString("postalCode"),
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

fun listaCandidaturas(list: ArrayList<Candidatura>, allList: ArrayList<Candidatura>, adapter: AdminCandidaturasActivity.CandidaturaAdapter, ctx: Context, admin:Boolean = false) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx,Request.Method.GET, "$API_URL/candidaturas?${if (admin) "admin" else ""}", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawCandidatura = response.getJSONObject(i)
            val candidatura = Candidatura(
                rawCandidatura.getInt("id"),
                rawCandidatura.getJSONObject("utilizador").getString("name"),
                rawCandidatura.getJSONObject("vaga").getString("title"),
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

            val utilizadoresArray = rawReuniao.getJSONArray("utilizadores")
            val utilizadoresList = ArrayList<String>()
            for (j in 0 until utilizadoresArray.length()) {
                val utilizadoresObj = utilizadoresArray.getJSONObject(j)
                val utilizador = utilizadoresObj.getString("name")
                utilizadoresList.add(utilizador)
            }

            val reuniao = Reuniao(
                rawReuniao.getString("title"),
                rawReuniao.getString("description"),
                rawReuniao.getString("subject"),
                rawReuniao.getString("startTime"),
                rawReuniao.getString("duration"),
                rawReuniao.getInt("id"),
                candidatura?.getJSONObject("vaga")?.getString("title"),
                negocio?.getString("title"),
                utilizadoresList
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

fun listarCentrosTrabalho(list: ArrayList<CentroTrabalho>,allList: ArrayList<CentroTrabalho>, adapter: CentroTrabalhoActivity.CentroTrabalhoAdapterX, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/centros-de-trabalho", null,
        { response ->
            for (i in 0 until response.length()) {
                val rawCentroTrabalho = response.getJSONObject(i)
                val centroTrabalho = CentroTrabalho(
                    rawCentroTrabalho.getInt("id"),
                    rawCentroTrabalho.getString("name"),
                    rawCentroTrabalho.getString("address"),
                    rawCentroTrabalho.getString("location"),
                    rawCentroTrabalho.getString("postalCode"),
                )
                list.add(centroTrabalho)
            }
            allList.addAll(list)
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

fun listaEventos(list: ArrayList<Evento>, allList: ArrayList<Evento>, adapter: CalendarioActivity.EventoAdapter, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx)

    val request = JsonArrayRequestWithCookie(ctx, Request.Method.GET, "$API_URL/events", null, { response -> try {
        for (i in 0 until response.length()) {
            val rawEvento = response.getJSONObject(i)
            val evento = Evento(
                rawEvento.getInt("id"),
                rawEvento.getString("startTime"),
                rawEvento.getInt("duration"),
                rawEvento.getString("title"),
                rawEvento.getString("description"),
                rawEvento.getString("subject"),
            )
            allList.add(evento)
        }

        val c = Calendar.getInstance()

        val dia = c.get(Calendar.DAY_OF_MONTH)
        val mes = c.get(Calendar.MONTH)
        val ano = c.get(Calendar.YEAR)

        val data = "$ano-${pad(mes + 1)}-${pad(dia)}"

        for (evento in allList) {
            if (evento.startTime.contains(data)) {
                list.add(evento)
            }
        }

        adapter.notifyDataSetChanged()
    } catch (e: JSONException) {
        e.printStackTrace()
    }
    }, { error -> error.printStackTrace() })

    queue.add(request)
}

fun login(email: String, password: String, ctx: Context, onError: () -> Unit) {
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
            onError()
            error.printStackTrace()
        })

    queue.add(request)
}

fun googleLogin(email: String, id: String, name: String, ctx: Context, onError: () -> Unit) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("email", email)
    body.put("id", id)
    body.put("name", name)

    val request = JsonObjectRequestWithSessionId(Request.Method.POST, "$API_URL/auth/google/callback/mobile", body,
        { response ->
            val cookie = response.getString("cookie")
            val data = response.getJSONObject("data")
            val user = data.getJSONObject("user")

            saveCurrentUser(ctx, user, cookie)

            val intent = Intent(ctx, MainActivity::class.java)
            ctx.startActivity(intent)
        },
        { error ->
            onError()
            error.printStackTrace()
        })

    queue.add(request)
}

fun facebookLogin(email: String, id: String, name: String, ctx: Context, onError: () -> Unit) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("email", email)
    body.put("id", id)
    body.put("name", name)

    val request = JsonObjectRequestWithSessionId(Request.Method.POST, "$API_URL/auth/facebook/callback/mobile", body,
        { response ->
            val cookie = response.getString("cookie")
            val data = response.getJSONObject("data")
            val user = data.getJSONObject("user")

            saveCurrentUser(ctx, user, cookie)

            val intent = Intent(ctx, MainActivity::class.java)
            ctx.startActivity(intent)
        },
        { error ->
            onError()
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
            Toast.makeText(ctx, "Codigo de verificação enviado!", Toast.LENGTH_LONG).show()

            val data = response.getJSONObject("data")
            val user = data.getInt("userId")

            val intent = Intent(ctx, ConfirmarContaActivity::class.java)
            intent.putExtra("userId", user)
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
    body.put("dataValidade", "$data.000Z")

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

fun createReunion(titulo:String, descricao:String, data:String, duracao:Int, userIds:ArrayList<Int>, negocioId: Int, subject:String, idCandidatura: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("title", titulo)
    body.put("description", descricao)
    body.put("startTime", data)
    body.put("duration", duracao)
    body.put("subject", subject)
    body.put("utilizadores", JSONArray(userIds))

    if (negocioId != -1) {
        body.put("idNegocio", negocioId)
    }

    if (idCandidatura != -1) {
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

fun createNegocio(titulo:String, area:Int, descricao:String, cliente: Int, contactos: ArrayList<Int>, necessidades: ArrayList<String>, tipoProjetoId:Int,  ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("title", titulo)
    body.put("description", descricao)
    body.put("idCliente", cliente)
    body.put("idAreaNegocio", area)
    body.put("contactos", JSONArray(contactos))
    body.put("necessidades", JSONArray(necessidades))
    body.put("idTipoProjeto", tipoProjetoId)

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
    body.put("idFuncionarioResponsavel", utilizadorId)

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

fun editNegocioUser( idNegocio: Int,  titulo: String, descricao: String, area: Int, necessidades: ArrayList<String>, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("title", titulo)
    body.put("description", descricao)
    body.put("idAreaNegocio", area)
    body.put("necessidades", JSONArray(necessidades))

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Method.PATCH, "$API_URL/negocios/$idNegocio", body, Response.Listener { response ->
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

        val intent = Intent(ctx, AdminActivity::class.java)
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

fun desativarUser(idUser: Int, disabled: Boolean, user: Int?,   ctx: Context, callback: () -> Unit ) {
    val queue = Volley.newRequestQueue(ctx)

    val body = JSONObject()
    body.put("disabled", disabled)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/utilizadores/$idUser/disable", body, Response.Listener { response ->
        Toast.makeText(ctx, "Utilizador desativado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminUtilizadoresActivity::class.java)
        ctx.startActivity(intent)
        callback.invoke()
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

fun editReuniao(idReuniao: Int,  descricao: String , titulo: String, assunto: String, duracao: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("description", descricao)
    body.put("title", titulo)
    body.put("subject", assunto)
    body.put("duration", duracao)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/reunioes/$idReuniao", body, Response.Listener { response ->
        Toast.makeText(ctx, "Reunião editada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, EditarReuniaoActivity::class.java)
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

fun mudarPasswordPerfil(passwordAntiga: String, passwordNova: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("passwordAtual", passwordAntiga)
    body.put("newPassword", passwordNova)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/utilizadores/@me/password", body, Response.Listener { response ->
        Toast.makeText(ctx, "Password alterada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, PerfilActivity::class.java)
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

            if (statusCode == 401) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())
                Toast.makeText(ctx, "Password atual incorreta!", Toast.LENGTH_LONG).show()

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw AuthFailureError()
            }

            return super.parseNetworkResponse(response)
        }
    }

    queue.add(request)
}

fun marcarTodasNotiLidas( ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/notificacoes/seen-all", body, Response.Listener { response ->
        Toast.makeText(ctx, "Notificações apagadas!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, NotificacoesActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            val statusCode = response?.statusCode ?: 0
            if (statusCode == 400) {
                val json = JSONObject(String(response?.data ?: ByteArray(0)))

                Log.i("Erro: ", json.toString())

                Toast.makeText(ctx, "Password atual incorreta!", Toast.LENGTH_LONG).show()

                if (json.has("message")) {
                    val message = json.getString("message")
                    Toast.makeText(ctx, message, Toast.LENGTH_LONG).show()
                }

                throw AuthFailureError()
            }

            return super.parseNetworkResponse(response)
        }
    }

    queue.add(request)
}

fun createAreaNegocio(nome: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("name", nome)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/areas-de-negocio", body, Response.Listener { response ->
        Toast.makeText(ctx, "Área de Negócio criada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AreasNegocioActivity::class.java)
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

fun deleteAreaNegocio(idAreaNegocio: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.DELETE, "$API_URL/areas-de-negocio/$idAreaNegocio", body, Response.Listener { response ->
        Toast.makeText(ctx, "Área de Negócio apagada com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AreasNegocioActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        Toast.makeText(ctx, "Área de Negócio em uso, impossivel de ser apagada!", Toast.LENGTH_LONG).show()
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun createTipoProjeto(nome: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("name", nome)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/tipos-projeto", body, Response.Listener { response ->
        Toast.makeText(ctx, "Tipo de Projeto criado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminTiposProjetoActivity::class.java)
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

fun deleteTipoProjeto(idTipoProjeto: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.DELETE, "$API_URL/tipos-projeto/$idTipoProjeto", body, Response.Listener { response ->
        Toast.makeText(ctx, "Tipo de Projeto apagado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, AdminTiposProjetoActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        Toast.makeText(ctx, "Tipo de Projeto em uso, impossivel de ser apagado!", Toast.LENGTH_LONG).show()
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun deleteCentroTrabalho(idCentroTrabalho: Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.DELETE, "$API_URL/centros-de-trabalho/$idCentroTrabalho", null, Response.Listener { response ->
        Toast.makeText(ctx, "Centro de Trabalho apagado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, CentroTrabalhoActivity::class.java)
        ctx.startActivity(intent)
    }, Response.ErrorListener { error ->
        Toast.makeText(ctx, "Centro de Trabalho em uso, impossivel de ser apagado!", Toast.LENGTH_LONG).show()
        error.printStackTrace()
    }) {
        override fun parseNetworkResponse(response: NetworkResponse?): Response<JSONObject> {
            return super.parseNetworkResponse(response)
        }
    }
    queue.add(request)
}

fun createCentroTrabalho(nome: String, location:String, address:String, postalCode:String , ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("name", nome)
    body.put("location", location)
    body.put("address", address)
    body.put("postalCode", postalCode)

    Log.i("body", body.toString())

    val request = object : JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/centros-de-trabalho", body, Response.Listener { response ->
        Toast.makeText(ctx, "Centro de Trabalho criado com sucesso!", Toast.LENGTH_LONG).show()

        val intent = Intent(ctx, CentroTrabalhoActivity::class.java)
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

fun uploadFile(ctx: Context, imageUri: Uri, image: Boolean, callback: (String?) -> Unit) {
    val client = OkHttpClient()

    val path = if (image) getPathFromUri(ctx, imageUri) else getPathFromUriPdf(ctx, imageUri)
    val file = File(path)
    val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())

    val requestBody = MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        .addFormDataPart("file", file.name, requestFile)
        .build()

    val cookie = getCookie(ctx)

    val request = okhttp3.Request.Builder()
        .url("$API_URL/uploads")
        .addHeader("Cookie", cookie!!)
        .post(requestBody)
        .build()

    client.newCall(request).enqueue(object : Callback, okhttp3.Callback {
        override fun onFailure(call: okhttp3.Call, e: IOException) {
            Log.i("Upload", "Failed to upload image")
            Log.i("Upload", e.message.toString())
            callback(null)
        }

        override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
            if (response.isSuccessful) {
                val body = response.body!!.string()
                val jsonObject = JSONObject(body)

                val fileName = jsonObject.getString("fileName")
                callback(fileName)
            } else {
                callback(null)
            }
        }
    })
}

fun getPathFromUri(ctx: Context, uri: Uri): String {
    val projection = arrayOf(MediaStore.Images.Media.DATA)
    val cursor = ctx.contentResolver.query(uri, projection, null, null, null)
    cursor?.use {
        if (it.moveToFirst()) {
            val columnIndex = it.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)
            return it.getString(columnIndex)
        }
    }
    return ""
}

fun getPathFromUriPdf(context: Context, uri: Uri): String {
    var filePath: String? = null
    val scheme = uri.scheme

    if (scheme == "content") {
        val cursor = context.contentResolver.query(uri, null, null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val columnIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                if (columnIndex != -1) {
                    val fileName = it.getString(columnIndex)
                    val cacheDir = context.externalCacheDir
                    if (cacheDir != null) {
                        val file = File(cacheDir, fileName)
                        val inputStream = context.contentResolver.openInputStream(uri)
                        if (inputStream != null) {
                            FileOutputStream(file).use { outputStream ->
                                val buffer = ByteArray(4 * 1024) // Adjust buffer size as needed
                                var bytesRead: Int
                                while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                                    outputStream.write(buffer, 0, bytesRead)
                                }
                                filePath = file.absolutePath
                            }
                        }
                    }
                }
            }
        }
    } else if (scheme == "file") {
        filePath = uri.path
    }

    return filePath ?: ""
}

fun editarUtilizadorAtual(cv: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("cv", cv)

    Log.i("body", body.toString())

    val request = JsonObjectRequestWithCookie(ctx, Request.Method.PATCH, "$API_URL/utilizadores/@me", body,
        { response ->

        },
        { error ->
            error.printStackTrace()
        })

    queue.add(request)
}

fun candidatarVaga(idVaga: Int, refEmail:String?, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("refEmail", refEmail)

    Log.i("body", body.toString())

    val request = JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/vagas/$idVaga/candidatar", body,
        { response ->
            Toast.makeText(ctx, "Candidatura efetuada com sucesso!", Toast.LENGTH_LONG).show()

            val intent = Intent(ctx, VagasActivity::class.java)
            ctx.startActivity(intent)
        },
        { error ->
            error.printStackTrace()
        })

    queue.add(request)
}

fun getReporting(ctx: Context, callback: (JSONObject) -> Unit) {
    val queue = Volley.newRequestQueue(ctx);

    val request = JsonObjectRequestWithCookie(ctx, Request.Method.GET, "$API_URL/reporting", null,
        { response ->
            callback(response)
        },
        { error ->
            error.printStackTrace()
        })

    queue.add(request)
}

fun forgetPassword(email: String, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("email", email)

    Log.i("body", body.toString())

    val request = JsonObjectRequestWithCookie(ctx, Request.Method.POST, "$API_URL/utilizadores/esqueceu-password", body,
        { response ->
            Toast.makeText(ctx, "Email enviado com sucesso!", Toast.LENGTH_LONG).show()

            val intent = Intent(ctx, LoginActivity::class.java)
            ctx.startActivity(intent)
        },
        { error ->
            error.printStackTrace()
        })

    queue.add(request)
}

fun enviarCodigoConfirmacao(userID:Int, email: String, ctx: Context, onError: () -> Unit) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("confirmCode", email)
    body.put("userId", userID)

    Log.i("body", body.toString())

    val request = JsonObjectRequestWithSessionId(Request.Method.POST, "$API_URL/auth/validate", body,
        { response ->
            val cookie = response.getString("cookie")
            val data = response.getJSONObject("data")
            val user = data.getJSONObject("user")

            saveCurrentUser(ctx, user, cookie)

            val intent = Intent(ctx, PerfilActivity::class.java)
            ctx.startActivity(intent)
        },
        { error ->
            onError()
            error.printStackTrace()
        })
    queue.add(request)
}

fun reenviarCodigoConfirmacao(userID:Int, ctx: Context) {
    val queue = Volley.newRequestQueue(ctx);

    val body = JSONObject()
    body.put("userId", userID)

    Log.i("body", body.toString())

    val request = JsonObjectRequestWithSessionId(Request.Method.POST, "$API_URL/auth/validate/retry", body,
        { response ->
            Toast.makeText(ctx, "Email enviado com sucesso!", Toast.LENGTH_LONG).show()
        },
        { error ->
            error.printStackTrace()
        })
    queue.add(request)
}

fun resolveIcon(path: String): String {
    return if (path.startsWith("/static")) "https://softinsa.almeidx.dev${path}" else "$API_URL/uploads/$path"
}
