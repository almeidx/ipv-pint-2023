package com.example.pint_mobile.pages

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.forgetPassword
import com.example.pint_mobile.utils.googleLogin
import com.example.pint_mobile.utils.login
import com.google.android.gms.auth.api.Auth
import com.google.android.material.textfield.TextInputEditText
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.tasks.Task

class LoginActivity : ActivityBase(R.layout.activity_login) {
    companion object {
        private const val TAG = "LoginActivity"
    }

    private lateinit var googleApiClient: GoogleApiClient
    private val RC_SIGN_IN = 9001

    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken(getString(R.string.default_web_client_id))
            .build()

        googleApiClient = GoogleApiClient.Builder(this)
            .enableAutoManage(this) {}
            .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
            .build()

        val googleBtn = findViewById<View>(R.id.loginGoogle)
        googleBtn.setOnClickListener { loginGoogle() }
    }

    fun loginBtn(_view: View) {
        val emailInput = findViewById<TextInputEditText>(R.id.email)
        val passwordInput = findViewById<TextInputEditText>(R.id.password)

        val email = emailInput.text.toString()
        val password = passwordInput.text.toString()

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()

            if (email.isEmpty()) {
                emailInput.setBackgroundResource(R.drawable.edittext_red_border)
            } else if (password.isEmpty()) {
                passwordInput.setBackgroundResource(R.drawable.edittext_red_border)
            }
        }

        login(email, password, this){
            emailInput.setBackgroundResource(R.drawable.edittext_red_border)
            passwordInput.setBackgroundResource(R.drawable.edittext_red_border)

            Toast.makeText(this, "Email ou password incorretos", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loginGoogle() {
        Log.i("Acc", "loginGoogle")

        val signInIntent = Auth.GoogleSignInApi.getSignInIntent(googleApiClient)
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == RC_SIGN_IN) {
            val result = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleSignInResult(result)
        }
    }

    private fun handleSignInResult(result: Task<GoogleSignInAccount>) {
        if (result.isSuccessful) {
            val account = result.result.account
            val id = result.result.id
            val name = result.result.displayName

            googleLogin(account!!.name, id!!, name!!, this)
        } else {
            result.exception?.printStackTrace()

            Toast.makeText(this, "Não foi possível fazer login com Google. Tente novamente", Toast.LENGTH_SHORT).show()
        }
    }

    fun loginFacebook(_view: View) {

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
