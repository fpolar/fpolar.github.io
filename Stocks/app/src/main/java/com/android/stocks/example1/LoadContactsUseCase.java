package com.android.stocks.example1;

import android.content.Context;

import androidx.annotation.NonNull;

import com.android.stocks.R;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

final class LoadContactsUseCase {

    Map<String, List<Contact>> execute(@NonNull final Context context) {
        final Map<String, List<Contact>> map = new LinkedHashMap<>();

        for (char letter = 'A'; letter <= 'Z'; letter++) {
            final List<Contact> filteredContacts = getContactsWithLetter(
                    context.getResources().getStringArray(R.array.months_array),
                    letter
            );

            if (filteredContacts.size() > 0) {
                map.put(String.valueOf(letter), filteredContacts);
            }
        }

        return map;
    }

    private List<Contact> getContactsWithLetter(@NonNull final String[] names, final char letter) {
        final List<Contact> contactsList = new ArrayList<>();

        for (final String name : names) {
            if (name.charAt(0) == letter) {
                contactsList.add(new Contact(name, getRandomImage(name)));
            }
        }

        return contactsList;
    }

    private int getRandomImage(@NonNull final String name) {
        return R.drawable.ic_arrow_back_black_24dp;
    }
}
