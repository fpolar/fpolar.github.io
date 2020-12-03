package com.android.stocks.example1;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.R;


final class StockItemViewHolder extends RecyclerView.ViewHolder {

    final View rootView;
    final ImageView changeImgItem;
    final ImageView arrowImgItem;
    final TextView nameItem;
    final TextView tickItem;
    final TextView priceItem;
    final TextView changeItem;

    StockItemViewHolder(@NonNull View view) {
        super(view);

        rootView = view;

        nameItem = view.findViewById(R.id.nameItem);
        tickItem = view.findViewById(R.id.tickItem);
        priceItem = view.findViewById(R.id.priceItem);
        changeItem = view.findViewById(R.id.changeItem);
        changeImgItem = view.findViewById(R.id.changeImgItem);
        arrowImgItem = view.findViewById(R.id.arrowImgItem);
    }
}
