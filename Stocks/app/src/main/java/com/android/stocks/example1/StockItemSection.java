package com.android.stocks.example1;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.DetailActivity;
import com.android.stocks.R;

import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;

final class StockItemSection extends Section {

    public final String title;
    public final List<StockItem> list;
    private final ClickListener clickListener;
    private static Context context;

    StockItemSection(@NonNull final String title, @NonNull final List<StockItem> list,
                     @NonNull final ClickListener clickListener) {
        super(SectionParameters.builder()
                .itemResourceId(R.layout.section_ex1_stock_item)
                .headerResourceId(R.layout.section_ex1_header)
                .build());

        this.title = title;
        this.list = list;
        this.clickListener = clickListener;
    }

    @Override
    public int getContentItemsTotal() {
        return list.size();
    }

    @Override
    public RecyclerView.ViewHolder getItemViewHolder(final View view) {
        return new StockItemViewHolder(view);
    }

    @Override
    public void onBindItemViewHolder(final RecyclerView.ViewHolder holder, final int position) {
        final StockItemViewHolder itemHolder = (StockItemViewHolder) holder;

        final StockItem stockItem = list.get(position);

        if(stockItem.shares > 0) {
            itemHolder.nameItem.setText(stockItem.shares+" share(s)");
        }else{
            itemHolder.nameItem.setText(stockItem.name);
        }

        if(!stockItem.change.isEmpty() && Float.parseFloat(stockItem.change) > 0) {
            itemHolder.changeImgItem.setImageResource(R.drawable.ic_twotone_trending_up_24);
            itemHolder.changeItem.setTextColor(Color.GREEN);
        }else if (!stockItem.change.isEmpty() && Float.parseFloat(stockItem.change) < 0){
            itemHolder.changeImgItem.setImageResource(R.drawable.ic_baseline_trending_down_24);
            itemHolder.changeItem.setTextColor(Color.RED);
        }

        if(stockItem.tick.equals("Net Worth") || stockItem.name.equals("Net Worth")){
            itemHolder.changeImgItem.setVisibility(View.GONE);
            itemHolder.arrowImgItem.setVisibility(View.GONE);
        }

        itemHolder.tickItem.setText(stockItem.tick);
        itemHolder.changeItem.setText(stockItem.change);
        itemHolder.priceItem.setText(stockItem.price);

        itemHolder.rootView.setOnClickListener(v ->
                clickListener.onItemRootViewClicked(this, itemHolder.getAdapterPosition())
        );
    }

    @Override
    public RecyclerView.ViewHolder getHeaderViewHolder(final View view) {
        return new HeaderViewHolder(view);
    }

    @Override
    public void onBindHeaderViewHolder(final RecyclerView.ViewHolder holder) {
        final HeaderViewHolder headerHolder = (HeaderViewHolder) holder;

        headerHolder.title.setText(title);
    }

    public void removeStock(String s) {
        for (int i=0;i<list.size();i++){
            StockItem stC = list.get(i);
            Log.d("CREATION", "setIndivStockData: "+ stC.tick+" - "+s);
            if(stC.tick.equals(s)){
                list.remove(i);
                break;
            }
        }
    }

    interface ClickListener {

        void onItemRootViewClicked(@NonNull final StockItemSection section, final int itemAdapterPosition);
    }

    public void setIndivStockData(StockItem st) {
        boolean contained = false;
        for (int i=0;i<list.size();i++){
            StockItem stC = list.get(i);
            Log.d("CREATION", "setIndivStockData: "+ stC.tick+" - "+st.tick);
            if(stC.tick.equals(st.tick)){
                list.set(i, st);
                contained = true;
            }
        }

        if(!contained){
            list.add(st);
        }
    }

    public void refreshNetWorth(float newAmt) {
        for (int i=0;i<list.size();i++){
            StockItem stC = list.get(i);
            Log.d("CREATION", "refreshNetWorth: "+ newAmt);
            StockItem st = new StockItem("Net Worth", "", ""+newAmt, "");
            if(stC.tick.equals("Net Worth")){
                list.set(i, st);
            }
        }

    }
}
