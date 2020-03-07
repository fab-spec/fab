Two return values for FAB responders:

`return new Request(relative_or_abs)`

Means, proxy this pls. If it's relative, it means, serve this asset. If absolute, proxy.

The original requests' headers are then used in the request.

`return fetch(relative_or_abs)`

Fetch will normally explode with a relative url, but we're considering that to be an "asset fetch". Up to the runtime to make it happen.

No headers persisted (the user can merge the original request if they choose)
