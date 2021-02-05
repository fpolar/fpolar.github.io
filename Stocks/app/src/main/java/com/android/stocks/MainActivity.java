package com.android.stocks;

import android.app.ActionBar;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Message;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.AppCompatAutoCompleteTextView;
import androidx.appcompat.widget.SearchView;

import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.example1.Example1Fragment;
import com.android.stocks.example1.SwipeToDeleteCallback;
import com.android.volley.Response;
import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if(false){
            SharedPreferences pref = getApplicationContext().getSharedPreferences("StockPrefs", 0); // 0 - for private mode
            SharedPreferences.Editor editor = pref.edit();

            editor.clear();
            editor.commit(); // commit changes

            editor.putFloat("net_worth", 20000);

            String[] favTicks = getApplicationContext().getResources().getStringArray(R.array.favorites_array);
            String favTickString = "";
            for (String ft : favTicks) {
                favTickString += ft + "|";
            }
            editor.putString("favorite_stocks", favTickString);

            String[] portTicks = getApplicationContext().getResources().getStringArray(R.array.portfolio_array);
            String portTickString = "";
            for (String pt : portTicks) {
                portTickString += pt + "|";
                editor.putInt(pt+"_shares", 1);
            }
            editor.putString("portfolio_stocks", portTickString);
            editor.commit();
        }

        setContentView(R.layout.activity_main);
        setTheme(R.style.Theme_Stocks);

        View e1Home = findViewById(R.id.example1Fragment);
        e1Home.setVisibility(View.GONE);

        new CountDownTimer(5000, 1000) {

            @Override
            public void onTick(long millisUntilFinished) {

            }

            public void onFinish() {
                ProgressBar spinner;
                spinner = (ProgressBar)findViewById(R.id.progressBar1);
                spinner.setVisibility(View.GONE);

                TextView t;
                t = (TextView)findViewById(R.id.progressBarText);
                t.setVisibility(View.GONE);

                View e1Home = findViewById(R.id.example1Fragment);
                e1Home.setVisibility(View.VISIBLE);
            }
        }.start();


    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.options_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }


    public void toggleAbout(View view) {
        TextView at = findViewById(R.id.about_text);
        if(at.getEllipsize() == null) {
            at.setEllipsize(TextUtils.TruncateAt.END);
            at.setMaxLines(2);
            at.setText(at.getContentDescription());
            at.setVisibility(View.GONE);
            at.setVisibility(View.VISIBLE);
            Button ab = findViewById(R.id.about_button);
            ab.setText("Show more...");
        }else {
            at.setEllipsize(null);
            at.setMaxLines(20);
            at.setText(at.getContentDescription());
            at.setVisibility(View.GONE);
            at.setVisibility(View.VISIBLE);
            Button ab = findViewById(R.id.about_button);
            ab.setText("Show less");
        }
    }


}
