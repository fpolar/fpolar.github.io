package com.android.stocks;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Response;
import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DetailActivity extends AppCompatActivity{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent myIntent = getIntent(); // gets the previously created intent
        String tick = myIntent.getStringExtra("tick"); // will return "FirstKeyValue"
        makeApiCall(tick);

        setContentView(R.layout.stock_detail);
        setTheme(R.style.Theme_Stocks);

        View e1Home = findViewById(R.id.header_name);
        e1Home.setVisibility(View.GONE);

        getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_arrow_back_grey_24dp);// set drawable icon
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.details_header, menu);
        return super.onCreateOptionsMenu(menu);
    }
    private void makeApiCall(String text) {
        ApiCall.make(getApplicationContext(), "api/details/"+text, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d("CREATION", "ApiCall_onResponse: "+response);
                //parsing logic, please change it as per your requirement
                Map<String, String> stringList = new HashMap<String, String>();
                try {
                    JSONObject resObj = new JSONObject(response);

                    TextView h1 = findViewById(R.id.header_name);
                    h1.setText(resObj.getString("name"));
                    h1.setVisibility(View.VISIBLE);

                    TextView ht = findViewById(R.id.header_tick);
                    ht.setText(text);
                    ht.setVisibility(View.VISIBLE);

                    TextView hp = findViewById(R.id.header_price);
                    hp.setText(resObj.getString("price"));
                    hp.setVisibility(View.VISIBLE);


                    float changeTemp = (Float.parseFloat(resObj.getString("high")) - Float.parseFloat(resObj.getString("low")))/Float.parseFloat(resObj.getString("low"));
                    String changeStr = String.format("%.2f", changeTemp*100);

                    TextView hc = findViewById(R.id.header_change);
                    hc.setText(changeStr);
                    if(changeTemp < 0) hc.setTextColor(Color.red(1));
                    if(changeTemp > 0) hc.setTextColor(Color.green(1));
                    hc.setVisibility(View.VISIBLE);

                    SharedPreferences pref = getApplicationContext().getSharedPreferences("StockPrefs", 0); // 0 - for private mode
                    int shares = pref.getInt(text+"_shares", -1);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //IMPORTANT: set data here and notify

                ProgressBar spinner;
                spinner = (ProgressBar)findViewById(R.id.progressBar1);
                spinner.setVisibility(View.GONE);

                TextView t;
                t = (TextView)findViewById(R.id.progressBarText);
                t.setVisibility(View.GONE);

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("CREATION", "ApiCall_errorResponse: "+error);
            }
        });
    }
}
