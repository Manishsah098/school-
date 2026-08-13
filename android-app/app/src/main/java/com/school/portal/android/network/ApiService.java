package com.school.portal.android.network;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import java.util.List;
import java.util.Map;

public interface ApiService {
    // Basic login structure, expects a map with username/password and returns a token map
    @POST("api/auth/login")
    Call<Map<String, String>> login(@Body Map<String, String> credentials);

    // Fetch notifications
    @GET("api/student/notifications")
    Call<List<Map<String, Object>>> getNotifications();
}
