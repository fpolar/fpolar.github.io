package com.android.stocks.example1;

import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.R;


final class HeaderViewHolder extends RecyclerView.ViewHolder {

    final TextView title;

    HeaderViewHolder(@NonNull View view) {
        super(view);

        title = view.findViewById(R.id.tvTitle);
    }
}
