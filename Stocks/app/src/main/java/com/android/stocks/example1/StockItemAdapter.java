package com.android.stocks.example1;

import android.content.Context;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.Filterable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class StockItemAdapter extends RecyclerView.Adapter implements Filterable {
    private List<StockItem> mlistData;

    public StockItemAdapter(@NonNull Context context, int resource) {
        super();
        mlistData = new ArrayList<>();
    }

    public void setData(List<StockItem> list) {
        mlistData.clear();
        mlistData.addAll(list);
    }

    @NonNull
    @Override
    public Filter getFilter() {
        Filter dataFilter = new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                FilterResults filterResults = new FilterResults();
                if (constraint != null) {
                    filterResults.values = mlistData;
                    filterResults.count = mlistData.size();
                }
                return filterResults;
            }

            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                if (results != null && (results.count > 0)) {
                    notifyDataSetChanged();
                } else {
                    notifyDataSetInvalidated();
                }
            }
        };
        return dataFilter;
    }

    private void notifyDataSetInvalidated() {
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return null;
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {

    }

    @Override
    public int getItemCount() {
        return 0;
    }

    public void setIndivStockData(StockItem st) {
        for (int i=0;i<mlistData.size();i++){
            StockItem stC = mlistData.get(i);
            if(stC.tick.equals(st.tick)){
                mlistData.set(i, st);
            }
        }
    }
}
