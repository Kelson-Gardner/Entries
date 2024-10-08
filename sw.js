import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ url }) => url.origin === 'https://kelson-gardner.github.io/Entries/',
  new StaleWhileRevalidate()
);