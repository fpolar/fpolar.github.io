package com.android.stocks;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.view.menu.ActionMenuItemView;

import com.android.volley.Response;
import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DetailActivity extends AppCompatActivity{

    boolean faved = false;
    String tick = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent myIntent = getIntent(); // gets the previously created intent
        this.tick = myIntent.getStringExtra("tick"); // will return "FirstKeyValue"
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
//        return super.onCreateOptionsMenu(menu);
        return true;
    }
    private void makeApiCall(String text) {
        ApiCall.make(getApplicationContext(), "api/details/"+text, new Response.Listener<String>() {
            @SuppressLint("RestrictedApi")//for setIcon
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
                    hp.setText(resObj.getString("last"));
                    hp.setVisibility(View.VISIBLE);

                    float changeTemp = (Float.parseFloat(resObj.getString("high")) - Float.parseFloat(resObj.getString("low")))/Float.parseFloat(resObj.getString("low"));
                    String changeStr = String.format("%.2f", changeTemp*100);

                    TextView hc = findViewById(R.id.header_change);
                    hc.setText(changeStr);
                    if(changeTemp < 0) hc.setTextColor(Color.red(1));
                    if(changeTemp > 0) hc.setTextColor(Color.green(1));
                    hc.setVisibility(View.VISIBLE);

                    final ActionMenuItemView starView =  findViewById(R.id.action_fave);
                    SharedPreferences pref = getApplicationContext().getSharedPreferences("StockPrefs", 0); // 0 - for private mode
                    String favString = pref.getString("favorite_stocks", "");
                    if(favString.contains(text)) {
                        starView.setIcon(getApplicationContext().getDrawable(R.drawable.ic_baseline_star_24));
                        faved = true;
                    }

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

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.action_fave:
                SharedPreferences pref = getApplicationContext().getSharedPreferences("StockPrefs", 0); // 0 - for private mode
                String favString = pref.getString("favorite_stocks", "");
                SharedPreferences.Editor editor = pref.edit();
                if(faved) {
                    favString = favString.replace(tick+"|","");
                    item.setIcon(getApplicationContext().getDrawable(R.drawable.ic_baseline_star_border_24));
                    faved = false;
                }else{
                    favString+=tick+"|";
                    item.setIcon(getApplicationContext().getDrawable(R.drawable.ic_baseline_star_24));
                    faved = true;
                }
                editor.putString("favorite_stocks", favString);
                editor.commit();
                favString = pref.getString("favorite_stocks", "");
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }

    }
}
