package com.android.stocks.example1;

import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.R;

import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;

final class StockItemSection extends Section {

    private final String title;
    private final List<StockItem> list;
    private final ClickListener clickListener;

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

        itemHolder.nameItem.setText(stockItem.name);
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
}
