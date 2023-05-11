package com.example.pint_mobile.utils

import android.content.Context
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import org.json.JSONArray

class JsonArrayRequestWithCookie(
    private val ctx: Context,
    method: Int,
    url: String,
    jsonRequest: JSONArray?,
    listener: Response.Listener<JSONArray>,
    errorListener: Response.ErrorListener
) : JsonArrayRequest(method, url, jsonRequest, listener, errorListener) {
    override fun getHeaders(): MutableMap<String, String> {
        val headers = HashMap<String, String>()

        val cookie = getCookie(ctx)
        if (cookie != null) {
            headers["Cookie"] = cookie
        }

        return headers
    }
}