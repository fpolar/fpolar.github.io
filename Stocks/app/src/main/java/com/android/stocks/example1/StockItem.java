package com.android.stocks.example1;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;

final class StockItem {
    final String name;
    final String tick;
    final int shares;
    final String price;
    final String change;

    StockItem(@NonNull final String tick, @NonNull final String name,  @NonNull final String price, @NonNull final String change) {
        this.name = name;
        this.tick = tick;
        this.price = price;
        this.change = change;
        this.shares = 0;
    }

    StockItem(@NonNull final String tick, @NonNull final String name,  @NonNull final String price, @NonNull final String change, @NonNull final int shares) {
        this.name = name;
        this.tick = tick;
        this.price = price;
        this.change = change;
        this.shares = shares;
    }
}
