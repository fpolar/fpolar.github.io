package com.android.stocks.example1;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.android.stocks.ApiCall;
import com.android.stocks.AutoSuggestAdapter;
import com.android.stocks.R;
import com.android.volley.Response;
import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
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

        final List<StockItem> favList = new ArrayList<>();
        String[] favTicks = context.getResources().getStringArray(R.array.favorites_array);
        for (String ft: favTicks ) {
            makeApiCall("Favorites", ft);
        }

        //create sections for the
        for (final String name : favTicks) {
            favList.add(new StockItem(name, name, "1", "1"));
        }
        if (favList.size() > 0) {
            map.put("Favorites", favList);
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
                    st = new StockItem(resObj.getString("ticker"),resObj.getString("name"),resObj.getString("last"),""+changeTemp);
                    stockList.add(st);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //IMPORTANT: set data here and notify
//                stockItemAdapter.setData(stockList);
                //stockItemAdapter.setIndivStockData(st);
                StockItemSection sec = (StockItemSection)sectionedAdapter.getSection(sectionName);
                sec.setIndivStockData(stockList.get(0));
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