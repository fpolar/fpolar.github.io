package com.android.stocks;

import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.Menu;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class DetailActivity extends AppCompatActivity{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.stock_detail);
        setTheme(R.style.Theme_Stocks);

        View e1Home = findViewById(R.id.header_name);
        e1Home.setVisibility(View.GONE);

        getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_arrow_back_grey_24dp);// set drawable icon
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


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

                TextView h1 = findViewById(R.id.header_name);
                h1.setText("THIS STOCK");
                h1.setVisibility(View.VISIBLE);
            }
        }.start();


    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.details_header, menu);
        return super.onCreateOptionsMenu(menu);
    }
//
//    @Override
//    public boolean onSupportNavigateUp (){
//        // Handle action bar item clicks here. The action bar will
//        // automatically handle clicks on the Home/Up button, so long
//        // as you specify a parent activity in AndroidManifest.xml.
//        int id = item.getItemId();
//
//        //noinspection SimplifiableIfStatement
//        if (id == R.id.action_settings) {
//            return true;
//        }
//
//        else if(id == R.id.homeAsUp){
//            Log.i("","Up is pressed");
//            finish();
//            return true;
//        }
//
//        return super.onOptionsItemSelected(item);
//    }

}
