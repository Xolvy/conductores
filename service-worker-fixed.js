// Service Worker mejorado para App Conductores
const CACHE_NAME = "conductores-app-v2";
const STATIC_CACHE_NAME = "conductores-static-v2";

// URLs críticas para cachear
const CRITICAL_URLS = ["/", "/index.html", "/manifest.json", "/favicon.ico"];

// URLs de recursos externos
const EXTERNAL_URLS = [
  "https://cdn.tailwindcss.com",
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js",
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js",
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js",
];

// Instalar Service Worker
self.addEventListener("install", function (event) {
  console.log("🔄 Service Worker: Instalando versión", CACHE_NAME);

  event.waitUntil(
    Promise.all([
      // Cache para recursos críticos
      caches.open(CACHE_NAME).then((cache) => {
        console.log("✅ Service Worker: Cacheando recursos críticos");
        return cache.addAll(CRITICAL_URLS).catch((err) => {
          console.warn(
            "⚠️ Service Worker: Error cacheando recursos críticos:",
            err
          );
          // No fallar si algunos recursos no se pueden cachear
          return Promise.resolve();
        });
      }),

      // Cache para recursos estáticos externos
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("✅ Service Worker: Cacheando recursos externos");
        return Promise.allSettled(
          EXTERNAL_URLS.map((url) =>
            fetch(url)
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response.clone());
                }
              })
              .catch((err) => {
                console.warn(
                  "⚠️ Service Worker: No se pudo cachear:",
                  url,
                  err
                );
              })
          )
        );
      }),
    ])
      .then(() => {
        console.log("✅ Service Worker: Instalación completada");
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error("❌ Service Worker: Error en instalación:", err);
      })
  );
});

// Activar Service Worker
self.addEventListener("activate", function (event) {
  console.log("🔄 Service Worker: Activando...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        const deletePromises = cacheNames
          .filter(
            (cacheName) =>
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE_NAME &&
              (cacheName.startsWith("conductores-") ||
                cacheName.startsWith("territorios-"))
          )
          .map((cacheName) => {
            console.log(
              "🗑️ Service Worker: Eliminando cache antiguo:",
              cacheName
            );
            return caches.delete(cacheName);
          });

        return Promise.all(deletePromises);
      })
      .then(() => {
        console.log("✅ Service Worker: Activado correctamente");
        return self.clients.claim();
      })
      .catch((err) => {
        console.error("❌ Service Worker: Error en activación:", err);
      })
  );
});

// Interceptar requests
self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);

  // Solo manejar requests HTTP/HTTPS
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Estrategia: Cache First para recursos estáticos, Network First para datos
  if (shouldCacheFirst(event.request)) {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(networkFirst(event.request));
  }
});

// Determinar si usar cache first
function shouldCacheFirst(request) {
  const url = new URL(request.url);

  // Cache first para recursos estáticos
  return (
    request.method === "GET" &&
    (url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".jpg") ||
      url.pathname.endsWith(".jpeg") ||
      url.pathname.endsWith(".gif") ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".ico") ||
      url.pathname.endsWith(".woff") ||
      url.pathname.endsWith(".woff2") ||
      url.hostname === "cdn.tailwindcss.com" ||
      url.hostname.includes("gstatic.com"))
  );
}

// Estrategia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log("📦 Service Worker: Cache hit para:", request.url);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch((err) => {
        console.warn("⚠️ Service Worker: Error guardando en cache:", err);
      });
    }

    return networkResponse;
  } catch (error) {
    console.error("❌ Service Worker: Error en cache first:", error);

    // Fallback a cache si network falla
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Último recurso: respuesta de error
    return new Response("Recurso no disponible offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Estrategia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Solo cachear respuestas exitosas para GET requests
    if (networkResponse.ok && request.method === "GET") {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch((err) => {
        console.warn("⚠️ Service Worker: Error guardando en cache:", err);
      });
    }

    return networkResponse;
  } catch (error) {
    console.log(
      "🌐 Service Worker: Network falló, buscando en cache:",
      request.url
    );

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Para navegación, devolver página offline
    if (request.destination === "document") {
      const offlineResponse = await caches.match("/");
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    throw error;
  }
}

// Manejar mensajes del cliente
self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("🔄 Service Worker: Forzando activación...");
    self.skipWaiting();
  }
});

// Sincronización en background (cuando esté disponible)
self.addEventListener("sync", function (event) {
  if (event.tag === "background-sync") {
    console.log("🔄 Service Worker: Sincronización en background");
    event.waitUntil(performBackgroundSync());
  }
});

async function performBackgroundSync() {
  try {
    // Implementar sincronización de datos pendientes
    console.log("✅ Service Worker: Sincronización completada");
  } catch (error) {
    console.error("❌ Service Worker: Error en sincronización:", error);
  }
}

console.log("🚀 Service Worker cargado:", CACHE_NAME);
