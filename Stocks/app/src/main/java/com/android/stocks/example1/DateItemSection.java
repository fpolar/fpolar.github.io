package com.android.stocks.example1;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.R;

import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;

final class DateItemSection extends Section {

    private final String date;
    private final ClickListener clickListener;

    DateItemSection(@NonNull final String date,
                    @NonNull final ClickListener clickListener) {
        super(SectionParameters.builder()
                .itemResourceId(R.layout.section_ex1_item)
                .headerResourceId(R.layout.section_ex1_header)
                .build());

        this.date = date;
        this.clickListener = clickListener;
    }

    @Override
    public int getContentItemsTotal() {
        return 0;
    }

    @Override
    public RecyclerView.ViewHolder getItemViewHolder(final View view) {
        return new ItemViewHolder(view);
    }

    @Override
    public void onBindItemViewHolder(final RecyclerView.ViewHolder holder, final int position) {
        final ItemViewHolder itemHolder = (ItemViewHolder) holder;


        itemHolder.tvItem.setText('x');

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

        headerHolder.title.setText('x');
    }

    interface ClickListener {

        void onItemRootViewClicked(@NonNull final DateItemSection section, final int itemAdapterPosition);
    }
}
