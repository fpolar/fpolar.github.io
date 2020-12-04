package com.android.stocks;

import android.content.Context;
import android.view.ActionProvider;
import android.view.Menu;
import android.view.View;
import android.widget.ImageView;

public class FavoriteStarProvider extends ActionProvider {
    /**
     * Creates a new instance. ActionProvider classes should always implement a
     * constructor that takes a single Context parameter for inflating from menu XML.
     *
     * @param context Context for accessing resources.
     */
    public FavoriteStarProvider(Context context) {
        super(context);
    }

    @Override
    public View onCreateActionView() {
        return null;
    }

    @Override
    public boolean onPerformDefaultAction (){

        return true;
    }
}
