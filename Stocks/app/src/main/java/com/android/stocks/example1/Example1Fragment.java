package com.android.stocks.example1;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatAutoCompleteTextView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.DetailActivity;
import com.android.stocks.R;

import java.text.DateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionAdapter;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

public class Example1Fragment extends Fragment implements StockItemSection.ClickListener {

    private static final String DIALOG_TAG = "SectionItemInfoDialogTag";

    private final Handler handler = new Handler();

    private SectionedRecyclerViewAdapter sectionedAdapter;

    RecyclerView recyclerView;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        final View view = inflater.inflate(R.layout.fragment_ex1, container, false);

        sectionedAdapter = new SectionedRecyclerViewAdapter();

        Date currentTime = Calendar.getInstance().getTime();
        String formattedDate = DateFormat.getDateInstance(DateFormat.FULL).format(currentTime);
        formattedDate = formattedDate.substring(formattedDate.indexOf(",")+1).trim();
        DateItemSection temp = new DateItemSection(formattedDate, null);
        sectionedAdapter.addSection("Date", temp);
        temp.setState(Section.State.LOADED);

        recyclerView = view.findViewById(R.id.recyclerview);
        final Map<String, List<StockItem>> sectionMap = new LoadStockItemsUseCase().execute(requireContext(), sectionedAdapter, recyclerView);

        for (final Map.Entry<String, List<StockItem>> entry : sectionMap.entrySet()) {
            if (entry.getValue().size() > 0) {
                sectionedAdapter.addSection(entry.getKey(), new StockItemSection(entry.getKey(), entry.getValue(), this));
            }
        }

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(sectionedAdapter);


        return view;
    }

    @Override
    public void onItemRootViewClicked(@NonNull StockItemSection section, int itemAdapterPosition) {
                int stockIdx = sectionedAdapter.getPositionInSection(itemAdapterPosition);
                String tickStr = section.list.get(stockIdx).tick;
                if(!tickStr.isEmpty() && !tickStr.equals("Net Worth")) {
                    Intent myIntent = new Intent(getContext(), DetailActivity.class);
                    myIntent.putExtra("tick", tickStr);
                    getContext().startActivity(myIntent);
                }
    }

    private void loadStock(final StockItemSection section) {
        changeSectionStateToLoading(section);

        handler.postDelayed(() -> {
                changeSectionStateToLoaded(section);
        }, 5000);
    }

    private void changeSectionStateToLoading(final StockItemSection section) {
        final SectionAdapter sectionAdapter = sectionedAdapter.getAdapterForSection(section);

        // store info of current section state before changing its state
        final Section.State previousState = section.getState();
        final int previousItemsQty = section.getContentItemsTotal();
        final boolean hadFooter = section.hasFooter();

        section.setHasFooter(false);
        if (hadFooter) {
            sectionAdapter.notifyFooterRemoved();
        }

        section.setState(Section.State.LOADING);
        if (previousState == Section.State.LOADED) {
            sectionAdapter.notifyStateChangedFromLoaded(previousItemsQty);
        } else {
            sectionAdapter.notifyNotLoadedStateChanged(previousState);
        }
    }

    private void changeSectionStateToLoaded(final StockItemSection section) {
        final SectionAdapter sectionAdapter = sectionedAdapter.getAdapterForSection(section);

        // store info of current section state before changing its state
        final Section.State previousState = section.getState();
        final boolean hadFooter = section.hasFooter();

        section.setState(Section.State.LOADED);
        sectionAdapter.notifyStateChangedToLoaded(previousState);

        section.setHasFooter(true);
        if (!hadFooter) {
            sectionAdapter.notifyFooterInserted();
        }
    }

}
