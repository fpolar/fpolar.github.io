package com.android.stocks;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.appcompat.widget.AppCompatAutoCompleteTextView;
import androidx.appcompat.widget.SearchView;
import androidx.core.view.ActionProvider;

import com.android.volley.Response;
import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class AutoCompSearchProvider extends ActionProvider {
    Context mContext;

    private static final int TRIGGER_AUTO_COMPLETE = 100;
    private static final long AUTO_COMPLETE_DELAY = 300;
    private Handler handler;
    private AutoSuggestAdapter autoSuggestAdapter;

    public AutoCompSearchProvider(Context context) {
        super(context);
        mContext = context;
    }

    @Override
    public View onCreateActionView() {
        LayoutInflater layoutInflater = LayoutInflater.from(mContext);
        View providerView = layoutInflater.inflate(R.layout.auto_comp_search, null);

            final AppCompatAutoCompleteTextView autoCompleteTextView =  providerView.findViewById(R.id.auto_complete_edit_text);
            final TextView selectedText = providerView.findViewById(R.id.selected_item);

            //Setting up the adapter for AutoSuggest
            autoSuggestAdapter = new AutoSuggestAdapter(mContext, android.R.layout.simple_dropdown_item_1line);
            autoCompleteTextView.setThreshold(2);
            autoCompleteTextView.setAdapter(autoSuggestAdapter);
            autoCompleteTextView.setOnItemClickListener(
                    new AdapterView.OnItemClickListener() {
                        @Override
                        public void onItemClick(AdapterView<?> parent, View view,
                                                int position, long id) {
                            selectedText.setText(autoSuggestAdapter.getObject(position));
                            Intent myIntent = new Intent(view.getContext(), DetailActivity.class);
                            mContext.startActivity(myIntent);
                        }
                    });
            autoCompleteTextView.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int
                        count, int after) {
                }
                @Override
                public void onTextChanged(CharSequence s, int start, int before,
                                          int count) {
                    handler.removeMessages(TRIGGER_AUTO_COMPLETE);
                    handler.sendEmptyMessageDelayed(TRIGGER_AUTO_COMPLETE,
                            AUTO_COMPLETE_DELAY);
                    Log.d("CREATION", "onTextChanged: "+s);
                }
                @Override
                public void afterTextChanged(Editable s) {
                }
            });
            handler = new Handler(new Handler.Callback() {
                @Override
                public boolean handleMessage(Message msg) {
                    if (msg.what == TRIGGER_AUTO_COMPLETE) {
                        Log.d("CREATION", "Handler: "+autoCompleteTextView.getText());
                        if (!TextUtils.isEmpty(autoCompleteTextView.getText())) {
                            makeApiCall(autoCompleteTextView.getText().toString());
                        }
                    }
                    return false;
                }
            });

        return providerView;
    }

    private void makeApiCall(String text) {
        ApiCall.make(mContext, "api/tick-search/"+text, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d("CREATION", "ApiCall_onResponse: "+response);
                //parsing logic, please change it as per your requirement
                List<String> stringList = new ArrayList<>();
                try {
                    JSONArray array = new JSONArray(response);
                    for (int i = 0; i < array.length(); i++) {
                        JSONObject row = array.getJSONObject(i);
                        stringList.add(row.getString("ticker"));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //IMPORTANT: set data here and notify
                autoSuggestAdapter.setData(stringList);
                autoSuggestAdapter.notifyDataSetChanged();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("CREATION", "ApiCall_errorResponse: "+error);
            }
        });
    }
}

