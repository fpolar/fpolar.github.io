package com.android.stocks.example1;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.stocks.R;

import java.util.List;
import java.util.Map;

import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

public class Example1Fragment extends Fragment implements ContactsSection.ClickListener {

    private static final String DIALOG_TAG = "SectionItemInfoDialogTag";

    private SectionedRecyclerViewAdapter sectionedAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        final View view = inflater.inflate(R.layout.fragment_ex1, container, false);

        sectionedAdapter = new SectionedRecyclerViewAdapter();

        final Map<String, List<Contact>> contactsMap = new LoadContactsUseCase().execute(requireContext());
        for (final Map.Entry<String, List<Contact>> entry : contactsMap.entrySet()) {
            if (entry.getValue().size() > 0) {
                sectionedAdapter.addSection(new ContactsSection(entry.getKey(), entry.getValue(), this));
            }
        }

        final RecyclerView recyclerView = view.findViewById(R.id.recyclerview);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(sectionedAdapter);

        return view;
    }

    @Override
    public void onItemRootViewClicked(@NonNull ContactsSection section, int itemAdapterPosition) {

    }
}
