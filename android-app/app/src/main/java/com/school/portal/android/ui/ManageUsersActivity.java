package com.school.portal.android.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.school.portal.android.databinding.ActivityManageUsersBinding;

public class ManageUsersActivity extends AppCompatActivity {

    private ActivityManageUsersBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityManageUsersBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        // TODO: Load users via Retrofit API
    }
}
