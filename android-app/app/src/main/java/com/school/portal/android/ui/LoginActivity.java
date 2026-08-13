package com.school.portal.android.ui;

import android.content.Intent;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.school.portal.android.databinding.ActivityLoginBinding;
import com.school.portal.android.network.ApiClient;
import com.school.portal.android.network.ApiService;
import java.util.HashMap;
import java.util.Map;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private String role;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        role = getIntent().getStringExtra("ROLE");

        binding.btnLogin.setOnClickListener(v -> performLogin());
    }

    private void performLogin() {
        String username = binding.etUsername.getText().toString();
        String password = binding.etPassword.getText().toString();

        if (username.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please enter all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        Map<String, String> creds = new HashMap<>();
        creds.put("email", username); // Backend expects "email"
        creds.put("password", password);
        
        apiService.login(creds).enqueue(new Callback<Map<String, String>>() {
            @Override
            public void onResponse(Call<Map<String, String>> call, Response<Map<String, String>> response) {
                if (response.isSuccessful()) {
                    // Success, navigate to Dashboard
                    Intent intent;
                    if ("ADMIN".equals(role)) {
                        intent = new Intent(LoginActivity.this, AdminDashboardActivity.class);
                    } else if ("TEACHER".equals(role)) {
                        intent = new Intent(LoginActivity.this, TeacherDashboardActivity.class);
                    } else {
                        intent = new Intent(LoginActivity.this, StudentDashboardActivity.class);
                    }
                    Toast.makeText(LoginActivity.this, "Logged in successfully!", Toast.LENGTH_SHORT).show();
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(LoginActivity.this, "Invalid credentials", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Map<String, String>> call, Throwable t) {
                Toast.makeText(LoginActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
