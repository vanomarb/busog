---
title: 'Install Busog and try offline mode'
description: 'Step-by-step help for install busog and try offline mode.'
category: 'Install'
image: 'pinakbet'
---

## Install on your phone

Open the Download page for steps for Safari on iPhone or Chrome on Android. The site must be served securely.
Installation makes a home-screen shortcut to the same demo.

## Let the first load finish

The service worker caches the app shell and hashed assets. Keep the first load online until the app has opened fully and
its assets are available. Offline diary and bundled food search use those files.

## Know the boundary

A live USDA request or new barcode lookup still needs a connection. The app explains unavailable barcode results and
quietly uses the bundled snapshot for ingredient search. Removing site data also removes the offline cache.

[Return to the demo](/busog/app/) or [browse common questions](/busog/faq/).
