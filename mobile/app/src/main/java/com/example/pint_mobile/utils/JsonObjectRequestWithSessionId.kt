package com.example.pint_mobile.utils

import com.android.volley.NetworkResponse
import com.android.volley.ParseError
import com.android.volley.Response
import com.android.volley.toolbox.HttpHeaderParser
import com.android.volley.toolbox.JsonObjectRequest
import org.json.JSONException
import org.json.JSONObject
import java.io.UnsupportedEncodingException
import java.nio.charset.Charset

class JsonObjectRequestWithSessionId(
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
