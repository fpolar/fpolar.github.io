package com.android.stocks.example1;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;

import com.android.stocks.ApiCall;
import com.android.stocks.AutoSuggestAdapter;
import com.android.stocks.R;
import com.android.volley.Response;
import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

final class LoadStockItemsUseCase {
    private SectionedRecyclerViewAdapter sectionedAdapter;
    private Context mContext;

    //returns a map of section name to list of items
    Map<String, List<StockItem>> execute(@NonNull final Context context, SectionedRecyclerViewAdapter sectionedAdapter) {
        mContext = context;
        final Map<String, List<StockItem>> map = new LinkedHashMap<>();

        this.sectionedAdapter = sectionedAdapter;

        SharedPreferences pref = mContext.getSharedPreferences("StockPrefs", 0); // 0 - for private mode

        //creating favorite section
        final List<StockItem> favList = new ArrayList<>();
        String rawFavs = pref.getString("favorite_stocks", null);
        Log.d("CREATION", "execute_readingLocalStorage: "+rawFavs);

        String[] favTicks = rawFavs.split("\\|");

        for (String ft: favTicks ) {
            if(!ft.isEmpty()) {
                makeApiCall("Favorites", ft);
            }
        }

        for (final String tick : favTicks) {
            if(!tick.isEmpty()) {
                favList.add(new StockItem(tick, tick, "1", "1"));
            }
        }
        if (favList.size() > 0) {
            map.put("Favorites", favList);
        }

        //creating portfolio section
        final List<StockItem> portList = new ArrayList<>();
        String rawPort = pref.getString("portfolio_stocks", null);
        Log.d("CREATION", "execute_readingLocalStorage: "+rawPort);

        String[] portTicks = rawPort.split("\\|");

        for (String pt: portTicks ) {
            if(!pt.isEmpty()) {
                makeApiCall("Portfolio", pt);
            }
        }

        //Networth Section
        portList.add(new StockItem("Net Worth", "", ""+pref.getFloat("net_worth", 20000), ""));

        for (final String tick : portTicks) {
            if(!tick.isEmpty()) {
                portList.add(new StockItem(tick, tick, "1", "1"));
            }
        }
        if (portList.size() > 0) {
            map.put("Portfolio", portList);
        }

        return map;
    }

    private void makeApiCall(String sectionName, String text) {
        ApiCall.make(mContext, "api/details/"+text, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d("CREATION", "makeApiCall_LoadStocks_onResponse: "+response);
                //parsing logic, please change it as per your requirement
                List<String> stringList = new ArrayList<>();
                List<StockItem> stockList = new ArrayList<>();
                StockItem st = new StockItem("","","0","0");
                try {
                    JSONObject resObj = new JSONObject(response);
                    Log.d("CREATION", "makeApiCall_LoadStocks_onJSO" +
                            "N: "+resObj.getString("name")+" - "+resObj.getString("last"));
                    float changeTemp = (Float.parseFloat(resObj.getString("high")) - Float.parseFloat(resObj.getString("low")))/Float.parseFloat(resObj.getString("low"));


                    SharedPreferences pref = mContext.getSharedPreferences("StockPrefs", 0); // 0 - for private mode
                    int shares = pref.getInt(text+"_shares", -1);

                    st = new StockItem(resObj.getString("ticker"),resObj.getString("name"),resObj.getString("last"),""+changeTemp);
                    if(shares > 0){
                        st = new StockItem(resObj.getString("ticker"),resObj.getString("name"),resObj.getString("last"),""+changeTemp, shares);
                    }

                    stockList.add(st);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //IMPORTANT: set data here and notify
//                stockItemAdapter.setData(stockList);
                //stockItemAdapter.setIndivStockData(st);
                StockItemSection sec = (StockItemSection)sectionedAdapter.getSection(sectionName);
                sec.setIndivStockData(stockList.get(0));
                 if(stockList.get(0).shares > 0){
                     SharedPreferences pref = mContext.getSharedPreferences("StockPrefs", 0); // 0 - for private mode
                     float newNetWorth = stockList.get(0).shares * Float.parseFloat(stockList.get(0).price) + pref.getFloat("net_worth", 20000);
                     sec.refreshNetWorth(newNetWorth);

                     SharedPreferences.Editor editor = pref.edit();
                     editor.putFloat("net_worth", newNetWorth);
                     editor.commit();
                 }

                Log.d("CREATION", "makeApiCall_LoadStocks_onAdapter: "+sec.getState()+" - "+stockList.get(0).name+" - "+stockList.get(0).price);
                sectionedAdapter.getAdapterForSection(sectionName).notifyAllItemsChanged();
                sectionedAdapter.notifyDataSetChanged();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("CREATION", "makeApiCall_LoadStocks_onErrorResponse: "+error);
            }
        });
    }
}