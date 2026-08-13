package com.school.portal.android.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.school.portal.android.databinding.ActivityAdminDashboardBinding;

public class AdminDashboardActivity extends AppCompatActivity {

    private ActivityAdminDashboardBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAdminDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // TODO: Setup click listeners for Admin Features
        // binding.btnManageStudents.setOnClickListener(v -> ...);
        // binding.btnManageTeachers.setOnClickListener(v -> ...);
        // binding.btnNotices.setOnClickListener(v -> ...);
        // binding.btnFees.setOnClickListener(v -> ...);
    }
}
