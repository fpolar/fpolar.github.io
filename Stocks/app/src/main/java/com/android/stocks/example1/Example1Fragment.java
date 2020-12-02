package com.android.stocks.example1;

import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Adapter;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatAutoCompleteTextView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.R;

import java.util.List;
import java.util.Map;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionAdapter;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

public class Example1Fragment extends Fragment implements StockItemSection.ClickListener {

    private static final String DIALOG_TAG = "SectionItemInfoDialogTag";

    private final Handler handler = new Handler();

    private SectionedRecyclerViewAdapter sectionedAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        final View view = inflater.inflate(R.layout.fragment_ex1, container, false);

        sectionedAdapter = new SectionedRecyclerViewAdapter();

        final Map<String, List<StockItem>> contactsMap = new LoadStockItemsUseCase().execute(requireContext(), sectionedAdapter);

        for (final Map.Entry<String, List<StockItem>> entry : contactsMap.entrySet()) {
            if (entry.getValue().size() > 0) {
                sectionedAdapter.addSection(entry.getKey(), new StockItemSection(entry.getKey(), entry.getValue(), this));
            }
        }

        final RecyclerView recyclerView = view.findViewById(R.id.recyclerview);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(sectionedAdapter);

        return view;
    }

    @Override
    public void onItemRootViewClicked(@NonNull StockItemSection section, int itemAdapterPosition) {

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
