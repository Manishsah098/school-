package com.school.portal.android.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.school.portal.android.databinding.ActivityNoticesBinding;

public class NoticesActivity extends AppCompatActivity {

    private ActivityNoticesBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityNoticesBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        // TODO: Load notices via Retrofit API
    }
}
