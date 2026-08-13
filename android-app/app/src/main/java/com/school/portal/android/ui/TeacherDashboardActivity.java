package com.school.portal.android.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.school.portal.android.databinding.ActivityTeacherDashboardBinding;

public class TeacherDashboardActivity extends AppCompatActivity {

    private ActivityTeacherDashboardBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityTeacherDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }
}
