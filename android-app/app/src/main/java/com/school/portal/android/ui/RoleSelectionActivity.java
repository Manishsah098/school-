package com.school.portal.android.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import com.school.portal.android.databinding.ActivityRoleSelectionBinding;

public class RoleSelectionActivity extends AppCompatActivity {

    private ActivityRoleSelectionBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRoleSelectionBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.btnAdmin.setOnClickListener(v -> navigateToLogin("ADMIN"));
        binding.btnTeacher.setOnClickListener(v -> navigateToLogin("TEACHER"));
        binding.btnStudent.setOnClickListener(v -> navigateToLogin("STUDENT"));
    }

    private void navigateToLogin(String role) {
        Intent intent = new Intent(this, LoginActivity.class);
        intent.putExtra("ROLE", role);
        startActivity(intent);
    }
}
