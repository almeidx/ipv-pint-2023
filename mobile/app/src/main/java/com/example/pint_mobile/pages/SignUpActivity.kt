package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.facebookLogin
import com.example.pint_mobile.utils.googleLogin
import com.example.pint_mobile.utils.signup
import com.facebook.CallbackManager
import com.facebook.FacebookCallback
import com.facebook.FacebookException
import com.facebook.GraphRequest
import com.facebook.login.LoginManager
import com.facebook.login.LoginResult
import com.google.android.gms.auth.api.Auth
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.tasks.Task

class SignUpActivity : ActivityBase(R.layout.activity_sign_up) {
    private lateinit var googleApiClient: GoogleApiClient
    private val RC_SIGN_IN = 9001

    private var callbackManager = CallbackManager.Factory.create()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken(getString(R.string.default_web_client_id))
            .build()

        googleApiClient = GoogleApiClient.Builder(this)
            .enableAutoManage(this) {}
            .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
            .build()

        callbackManager = CallbackManager.Factory.create()
        LoginManager.getInstance().registerCallback(callbackManager, object :
            FacebookCallback<LoginResult> {
            override fun onSuccess(result: LoginResult) {
                val request = GraphRequest.newMeRequest(result.accessToken) { jsonObject, _ ->
                    if (jsonObject == null) {
                        Log.i("fbLog", "jsonObject is null")
                        return@newMeRequest
                    }

                    val name = jsonObject.getString("name")
                    val email = jsonObject.getString("email")
                    val id = jsonObject.getString("id")

                    facebookLogin(email, id, name, this@SignUpActivity) {
                        Toast.makeText(
                            this@SignUpActivity,
                            "O email que introduziu já se encontra registado",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                val parameters = Bundle()
                parameters.putString("fields", "name,email")
                request.parameters = parameters
                request.executeAsync()
            }

            override fun onCancel() {
                Log.i("fbLog", "facebook:onCancel")
            }

            override fun onError(error: FacebookException) {
                error.printStackTrace()

                Toast.makeText(
                    this@SignUpActivity,
                    "Não foi possível fazer login com Facebook. Tente novamente",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    fun criarConta(_view: View) {
        val nome = findViewById<EditText>(R.id.nome).text.toString()
        val apelido = findViewById<EditText>(R.id.apelido).text.toString()
        val email = findViewById<EditText>(R.id.email).text.toString()
        val password = findViewById<EditText>(R.id.password).text.toString()
        val confirmPassword = findViewById<EditText>(R.id.confirmPassword).text.toString()

        if (nome.isEmpty()) {
            val nomeInput = findViewById<EditText>(R.id.nome)
            nomeInput.setBackgroundResource(R.drawable.edittext_red_border)
            return
        }
        if (apelido.isEmpty()) {
            val apelidoInput = findViewById<EditText>(R.id.apelido)
            apelidoInput.setBackgroundResource(R.drawable.edittext_red_border)
            return
        }

        if (email.isEmpty()) {
            val emailInput = findViewById<EditText>(R.id.email)
            emailInput.setBackgroundResource(R.drawable.edittext_red_border)
            return
        }

        var errorMsg: String? = null

        if (password.isEmpty()) {
            errorMsg = "Campo obrigatório"
        } else if (password.length < 8) {
            errorMsg = "A password tem de ter pelo menos 8 caracteres"
        } else if (password.length > 128) {
            errorMsg = "A password tem de ter menos de 128 caracteres"
        } else if (!password.matches(".*[A-Z].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos uma letra maiúscula"
        } else if (!password.matches(".*[a-z].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos uma letra minúscula"
        } else if (!password.matches(".*[0-9].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos um número"
        } else if (!password.matches(".*[^a-zA-Z0-9].*".toRegex())) {
            errorMsg = "A password tem de ter pelo menos um caracter especial"
        }

        if (errorMsg != null) {
            Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show()
            val confirmPasswordInput = findViewById<EditText>(R.id.password)
            confirmPasswordInput.setBackgroundResource(R.drawable.edittext_red_border)
            return
        }

        if (password != confirmPassword) {
            Toast.makeText(this, "As passwords não coincidem", Toast.LENGTH_SHORT).show()
            val confirmPasswordInput = findViewById<EditText>(R.id.confirmPassword)
            confirmPasswordInput.setBackgroundResource(R.drawable.edittext_red_border)
            return
        }

        signup("$nome $apelido", email, password, this)

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == RC_SIGN_IN) {
            val result = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleGoogleLogin(result)
        } else {
            callbackManager.onActivityResult(requestCode, resultCode, data)
        }
    }

    private fun handleGoogleLogin(result: Task<GoogleSignInAccount>) {
        if (result.isSuccessful) {
            val account = result.result.account
            val id = result.result.id
            val name = result.result.displayName

            googleLogin(account!!.name, id!!, name!!, this) {
                Toast.makeText(
                    this,
                    "O email que introduziu já se encontra registado",
                    Toast.LENGTH_SHORT
                ).show()
            }
        } else {
            result.exception?.printStackTrace()

            Toast.makeText(
                this,
                "Não foi possível fazer login com Google. Tente novamente",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    fun criarGoogle(_view: View) {
        val signInIntent = Auth.GoogleSignInApi.getSignInIntent(googleApiClient)
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    fun criarFacebook(_view: View) {
        LoginManager.getInstance().logInWithReadPermissions(this, listOf("public_profile", "email"))
    }

    fun jaTemConta(_view: View) {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0)
    }
}
