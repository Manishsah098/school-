package com.school.portal.android.ui;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.school.portal.android.databinding.ActivityNotificationsBinding;
import com.school.portal.android.network.ApiClient;
import com.school.portal.android.network.ApiService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class NotificationsActivity extends AppCompatActivity {

    private ActivityNotificationsBinding binding;
    private ApiService apiService;
    private ArrayList<String> notificationMessages = new ArrayList<>();
    private ArrayAdapter<String> adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityNotificationsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, notificationMessages);
        binding.lvNotifications.setAdapter(adapter);

        apiService = ApiClient.getClient().create(ApiService.class);
        fetchNotifications();
    }

    private void fetchNotifications() {
        apiService.getNotifications().enqueue(new Callback<List<Map<String, Object>>>() {
            @Override
            public void onResponse(Call<List<Map<String, Object>>> call, Response<List<Map<String, Object>>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    notificationMessages.clear();
                    for (Map<String, Object> notif : response.body()) {
                        String message = (String) notif.get("message");
                        String date = (String) notif.get("createdAt");
                        notificationMessages.add(date + "\n" + message);
                    }
                    adapter.notifyDataSetChanged();
                } else {
                    Toast.makeText(NotificationsActivity.this, "Failed to load notifications", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Map<String, Object>>> call, Throwable t) {
                Toast.makeText(NotificationsActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
