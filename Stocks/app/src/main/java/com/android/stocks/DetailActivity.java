package com.android.stocks;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.text.TextUtils;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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

    final Context context = this;
    boolean faved = false;
    String tick = "";
    private Button button;

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

        button = (Button) findViewById(R.id.portfolio_button);

        // add button listener
        button.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View arg0) {

                // custom dialog
                final Dialog dialog = new Dialog(context);
                dialog.setContentView(R.layout.trade_dialogue);
                dialog.setTitle("Title...");

                // set the custom dialog components - text, image and button
                TextView text = (TextView) dialog.findViewById(R.id.dialogue_title);
                text.setText("Android custom dialog example!");

                Button dialogButton = (Button) dialog.findViewById(R.id.dialogue_buy_button);
                // if button is clicked, close the custom dialog
                dialogButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        EditText dIn = (EditText) dialog.findViewById(R.id.dialogue_input);
                        int shareNum = Integer.parseInt(dIn.getText().toString());
                        float sharePrice = Float.parseFloat((String) ((TextView)findViewById(R.id.header_price)).getText());
                        if(shareNum*sharePrice>20000) {

                        }else {
                            SharedPreferences pref = getApplicationContext().getSharedPreferences("StockPrefs", 0); // 0 - for private mode
                            SharedPreferences.Editor editor = pref.edit();

                            int numSharesOwned = pref.getInt(tick+"_shares", 0)+shareNum;
                            editor.putInt(tick+"_shares", numSharesOwned);
                            tradeCompleteDialogue("You have successfully bought " + shareNum + " shares of " + tick);
                            editor.commit();
                            dialog.dismiss();
                        }
                    }
                });

                Button dialogButton2 = (Button) dialog.findViewById(R.id.dialogue_sell_button);
                // if button is clicked, close the custom dialog
                dialogButton2.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        EditText dIn = (EditText) dialog.findViewById(R.id.dialogue_input);
                        int shareNum = Integer.parseInt(dIn.getText().toString());
                        float sharePrice = Float.parseFloat((String) ((TextView)findViewById(R.id.header_price)).getText());
                        if(shareNum*sharePrice>20000) {

                        }else {
                            SharedPreferences pref = getApplicationContext().getSharedPreferences("StockPrefs", 0); // 0 - for private mode
                            SharedPreferences.Editor editor = pref.edit();

                            int numSharesOwned = pref.getInt(tick+"_shares", 0)-shareNum;
                            editor.putInt(tick+"_shares", numSharesOwned);
                            if(numSharesOwned<0){
                                editor.remove(tick+"_shares");
                                String portString = pref.getString("portfolio_stocks", "");
                                portString = portString.replace(tick+"|","");
                                editor.putString("portfolio_stocks", portString);
                            }
                            editor.commit();
                            tradeCompleteDialogue("You have successfully sold " + shareNum + " shares of " + tick);
                            dialog.dismiss();
                        }
                    }
                });

                dialog.show();
            }
        });

    }

    public void tradeCompleteDialogue(String message){
        // custom dialog
        final Dialog dialog = new Dialog(context);
        dialog.setContentView(R.layout.trade_complete_dialogue);

        // set the custom dialog components - text, image and button
        TextView text = (TextView) dialog.findViewById(R.id.dialogue_complete_title);
        text.setText(message);


        Button dialogButton = (Button) dialog.findViewById(R.id.dialogue_complete_button);
        // if button is clicked, close the custom dialog
        dialogButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
        dialog.show();
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

                    if(resObj.has("details")){
                        TextView h1 = findViewById(R.id.header_name);
                        h1.setText("MAX TIINGO REQUESTS REACHED");
                    }else{

                        TextView h1 = findViewById(R.id.header_name);
                        h1.setText(resObj.getString("name"));
                        h1.setVisibility(View.VISIBLE);

                        TextView ht = findViewById(R.id.header_tick);
                        ht.setText(text);
                        ht.setVisibility(View.VISIBLE);

                        TextView hp = findViewById(R.id.header_price);
                        hp.setText(resObj.getString("last"));
                        hp.setVisibility(View.VISIBLE);

                        float changeTemp = (Float.parseFloat(resObj.getString("last")) - Float.parseFloat(resObj.getString("prevClose")))/Float.parseFloat(resObj.getString("prevClose"));
                        String changeStr = String.format("%.2f", changeTemp*100);

                        TextView hc = findViewById(R.id.header_change);
                        hc.setText(changeStr);
                        if(changeTemp < 0) hc.setTextColor(Color.GREEN);
                        if(changeTemp > 0) hc.setTextColor(Color.RED);
                        hc.setVisibility(View.VISIBLE);


                        SharedPreferences pref = getApplicationContext().getSharedPreferences("StockPrefs", 0); // 0 - for private mode
                        String favString = pref.getString("favorite_stocks", "");

                        //favorite star
                        final ActionMenuItemView starView =  findViewById(R.id.action_fave);
                        if(favString.contains(text)) {
                            starView.setIcon(getApplicationContext().getDrawable(R.drawable.ic_baseline_star_24));
                            faved = true;
                        }

                        //portfolio section
                        int numShares = pref.getInt(text+"_shares", 0);
                        TextView ps = findViewById(R.id.portfolio_shares);
                        ps.setText("Shares Owned: "+numShares);
                        ps.setVisibility(View.VISIBLE);

                        TextView pv = findViewById(R.id.portfolio_value);
                        if(numShares>0){
                            pv.setText("Market Value: "+numShares*Float.parseFloat(resObj.getString("last")));
                        }else{
                            pv.setText("Start Trading!");
                        }
                        pv.setVisibility(View.VISIBLE);

                        //stats section
                        TextView scp = findViewById(R.id.stats_price);
                        scp.setText("Current Price: "+resObj.getString("last"));
                        scp.setVisibility(View.VISIBLE);
                        TextView sl = findViewById(R.id.stats_low);
                        sl.setText("Low: "+resObj.getString("low"));
                        sl.setVisibility(View.VISIBLE);
                        TextView sbp = findViewById(R.id.stats_bid);
                        sbp.setText("Bid Price: "+resObj.getString("bidPrice"));
                        sbp.setVisibility(View.VISIBLE);
                        TextView so = findViewById(R.id.stats_open);
                        so.setText("Open Price: "+resObj.getString("open"));
                        so.setVisibility(View.VISIBLE);
                        TextView sm = findViewById(R.id.stats_mid);
                        sm.setText("Current Price: "+resObj.getString("mid"));
                        sm.setVisibility(View.VISIBLE);
                        TextView sh = findViewById(R.id.stats_high);
                        sh.setText("Current Price: "+resObj.getString("high"));
                        sh.setVisibility(View.VISIBLE);
                        TextView sv = findViewById(R.id.stats_volume);
                        sv.setText("Current Price: "+resObj.getString("volume"));
                        sv.setVisibility(View.VISIBLE);

                        //about section
                        TextView at = findViewById(R.id.about_text);
                        at.setText(resObj.getString("description"));
                        at.setContentDescription(resObj.getString("description"));
                        at.setVisibility(View.VISIBLE);
                        Button ab = findViewById(R.id.about_button);
                        ab.setVisibility(View.VISIBLE);
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

    public void toggleAbout(View view){

        TextView at = findViewById(R.id.about_text);
        if(at.getEllipsize() == null) {
            at.setEllipsize(TextUtils.TruncateAt.END);
            Button ab = findViewById(R.id.about_button);
            ab.setText("Show more...");
        }else {
            at.setEllipsize(null);
            Button ab = findViewById(R.id.about_button);
            ab.setText("Show less");
        }
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
