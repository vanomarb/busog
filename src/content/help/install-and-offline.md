---
title: 'Install Busog and try offline mode'
description: 'Add Busog to your home screen and keep logging offline.'
category: 'Install'
image: 'pinakbet'
---

## Install on your phone

Open the Download page for steps for Safari on iPhone or Chrome on Android. The site must be served securely. Installing
adds Busog to your home screen.

## Let the first load finish

The service worker caches the app shell and hashed assets. Keep the first load online until the app has opened fully and
its assets are available. Offline diary and bundled food search use those files.

## Know the boundary

A live USDA request or new barcode lookup still needs a connection. The app explains unavailable barcode results and
quietly uses the bundled snapshot for ingredient search. Removing site data also removes the offline cache.

[Back to Busog](/busog/app/) or [browse common questions](/busog/faq/).
