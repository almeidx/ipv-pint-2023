package com.example.pint_mobile.pages

import android.content.Intent
import android.util.Log
import android.view.View
import android.widget.Toast
import com.example.pint_mobile.MainActivity
import com.example.pint_mobile.R
import com.example.pint_mobile.utils.ActivityBase
import com.example.pint_mobile.utils.forgetPassword
import com.example.pint_mobile.utils.login
import com.google.android.material.textfield.TextInputEditText
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task

class LoginActivity : ActivityBase(R.layout.activity_login) {
    companion object {
        private const val TAG = "LoginActivity"
    }

    private lateinit var mGoogleSignInClient: GoogleSignInClient
    private val RC_SIGN_IN = 9001
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

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .build()

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso)
    }

    fun loginGoogle(_view: View) {
        val signInIntent = mGoogleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleSignInResult(task)
        }
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            val account = completedTask.getResult(ApiException::class.java)
            updateUI(account)
        } catch (e: ApiException) {
            Log.w(TAG, "signInResult:failed code=" + e.statusCode)
            updateUI(null)
        }
    }

    private fun updateUI(account: GoogleSignInAccount?) {
        if (account != null) {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        } else {
            Toast.makeText(this, "Erro ao fazer login", Toast.LENGTH_SHORT).show()
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