package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.CheckBox
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.deleteAuthData
import com.example.pint_mobile.utils.facebookLogin
import com.example.pint_mobile.utils.forgetPassword
import com.example.pint_mobile.utils.getAuthData
import com.example.pint_mobile.utils.googleLogin
import com.example.pint_mobile.utils.login
import com.example.pint_mobile.utils.saveAuthData
import com.facebook.CallbackManager.Factory.create
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
import com.google.android.material.textfield.TextInputEditText

class LoginActivity : ActivityBase(R.layout.activity_login) {
    private lateinit var googleApiClient: GoogleApiClient
    private val RC_SIGN_IN = 9001

    private var callbackManager = create();

    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        getAuthData(this) { email, password ->
            findViewById<TextInputEditText>(R.id.email).setText(email)
            findViewById<TextInputEditText>(R.id.password).setText(password)
            findViewById<CheckBox>(R.id.lembrarPwd).isChecked = true
        }

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken(getString(R.string.default_web_client_id))
            .build()

        googleApiClient = GoogleApiClient.Builder(this)
            .enableAutoManage(this) {}
            .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
            .build()

        callbackManager = create()
        LoginManager.getInstance().registerCallback(callbackManager, object : FacebookCallback<LoginResult> {
            override fun onSuccess(result: LoginResult) {
                val request = GraphRequest.newMeRequest(result.accessToken) { jsonObject, _ ->
                    if (jsonObject == null) {
                        Log.i("fbLog", "jsonObject is null")
                        return@newMeRequest
                    }

                    val name = jsonObject.getString("name")
                    val email = jsonObject.getString("email")
                    val id = jsonObject.getString("id")

                    facebookLogin(email, id, name, this@LoginActivity) {
                        Toast.makeText(this@LoginActivity, "O email que introduziu já se encontra registado", Toast.LENGTH_SHORT).show()
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

                Toast.makeText(this@LoginActivity, "Não foi possível fazer login com Facebook. Tente novamente", Toast.LENGTH_SHORT).show()
            }
        })
    }

    fun loginBtn(_view: View) {
        val emailInput = findViewById<TextInputEditText>(R.id.email)
        val passwordInput = findViewById<TextInputEditText>(R.id.password)
        val lembrarPwd = findViewById<CheckBox>(R.id.lembrarPwd)

        val email = emailInput.text.toString()
        val password = passwordInput.text.toString()

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()

            if (email.isEmpty()) {
                emailInput.setBackgroundResource(R.drawable.edittext_red_border)
            }
            if (password.isEmpty()) {
                passwordInput.setBackgroundResource(R.drawable.edittext_red_border)
            }

            return
        }

        login(email, password, this, {
            if (lembrarPwd.isChecked) {
                saveAuthData(this, email, password)
            } else {
                deleteAuthData(this)
            }
        })  {
            emailInput.setBackgroundResource(R.drawable.edittext_red_border)
            passwordInput.setBackgroundResource(R.drawable.edittext_red_border)

            Toast.makeText(this, "Email ou password incorretos", Toast.LENGTH_SHORT).show()
        }
    }

    fun loginGoogle(_view: View) {
        val signInIntent = Auth.GoogleSignInApi.getSignInIntent(googleApiClient)
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == RC_SIGN_IN) {
            val result = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleGoogleLogin(result)
        } else {
            callbackManager.onActivityResult(requestCode, resultCode, data);
        }
    }

    private fun handleGoogleLogin(result: Task<GoogleSignInAccount>) {
        if (result.isSuccessful) {
            val account = result.result.account
            val id = result.result.id
            val name = result.result.displayName

            googleLogin(account!!.name, id!!, name!!, this) {
                Toast.makeText(this, "O email que introduziu já se encontra registado", Toast.LENGTH_SHORT).show()
            }
        } else {
            result.exception?.printStackTrace()

            Toast.makeText(this, "Não foi possível fazer login com Google. Tente novamente", Toast.LENGTH_SHORT).show()
        }
    }

    fun loginFacebook(_view: View) {
        LoginManager.getInstance().logInWithReadPermissions(this, listOf("public_profile", "email"))
    }

    fun esqueceuPassword(_view: View) {

        val email = findViewById<TextInputEditText>(R.id.email)
        val emailText = email.text.toString()

        if (emailText.isEmpty()) {
            Toast.makeText(this, "Preencha o campo email", Toast.LENGTH_SHORT).show()
            email.setBackgroundResource(R.drawable.edittext_red_border)
            return
        }

        forgetPassword(emailText, this)
    }

    fun aindaNaoTemConta(_view: View) {
        val intent = Intent(this, SignUpActivity::class.java)
        startActivity(intent)
        overridePendingTransition(0, 0);
    }
}
