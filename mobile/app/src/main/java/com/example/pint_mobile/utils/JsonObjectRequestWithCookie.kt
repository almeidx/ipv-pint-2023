package com.example.pint_mobile.utils

import android.content.Context
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import org.json.JSONObject

open class JsonObjectRequestWithCookie(
    private val ctx: Context,
    method: Int,
    url: String,
    jsonRequest: JSONObject?,
    listener: Response.Listener<JSONObject>,
    errorListener: Response.ErrorListener
) : JsonObjectRequest(method, url, jsonRequest, listener, errorListener) {
    override fun getHeaders(): MutableMap<String, String> {
        val headers = HashMap<String, String>()

        val cookie = getCookie(ctx)
        if (cookie != null) {
            headers["Cookie"] = cookie
        }

        return headers
    }
}