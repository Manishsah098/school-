package com.school.portal.android.ui;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.school.portal.android.databinding.ActivityStudentDashboardBinding;

public class StudentDashboardActivity extends AppCompatActivity {

    private ActivityStudentDashboardBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityStudentDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        binding.btnNotices.setOnClickListener(v -> {
            Intent intent = new Intent(StudentDashboardActivity.this, NotificationsActivity.class);
            startActivity(intent);
        });
    }
}
