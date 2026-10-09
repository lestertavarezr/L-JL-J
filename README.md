# Lester & Jhomayri · Invitación web

Invitación estática y adaptable a móvil, basada en el PDF facilitado. Incluye fotografías y ornamentos extraídos del PDF, apertura del sobre con CSS 3D, cuenta regresiva, lugares, vestimenta, música opcional y confirmación configurable. No requiere backend ni compilación.

## Vista local

Desde esta carpeta, ejecuta `python3 -m http.server 8000` y abre `http://localhost:8000`. El archivo `index.html` también abre directamente, pero usa un servidor local para comprobar enlaces y recursos.

## Cambios antes de compartirla

1. **Música:** coloca un archivo autorizado en `assets/audio/wedding-music.mp4` o `assets/audio/wedding-music.mp3`. El video de YouTube indicado como referencia no se descarga ni se incrusta. Los navegadores pueden rechazar la reproducción; la invitación abre normalmente. El control aparece solo cuando la pista se reproduce.
2. **Formulario:** crea y publica un Google Form, copia el vínculo público de respuesta en `formUrl` dentro de `config.js`. Hasta entonces se muestra un aviso elegante en vez de un botón roto. Si quieres que el código familiar y el número de invitados viajen a campos prellenados, obtén los identificadores `entry.123…` mediante Google Forms > menú de tres puntos > Obtener enlace prellenado y configúralos en `formFields`.
3. **Enlaces familiares:** `https://TU-USUARIO.github.io/lester-jhomayri-boda/?code=FAM001&guests=5` muestra el código y el cupo indicado y, si configuras sus campos, los transmite al formulario. Un enlace con `guests=1` indica una persona. **Cualquiera puede cambiar estos parámetros.** No son un control de acceso. Mantén la lista privada fuera de GitHub y valida código/cupo con Google Sheets + Apps Script u otra solución externa antes de aceptar respuestas. Google Forms por sí solo no puede imponer cupos individuales seguros.
4. **Regalos:** los números de cuenta y de identificación del PDF se excluyeron por privacidad. Comparte esos datos directamente con quien los solicite.
5. **Direcciones:** los botones abren búsquedas de Google Maps por el nombre de cada lugar; comprueba el resultado concreto antes de distribuir el enlace. La hora publicada para la recepción, «Después de la ceremonia», es una indicación editorial y no una hora confirmada.

## Publicación gratuita en GitHub Pages

1. Crea un repositorio público llamado `lester-jhomayri-boda` en GitHub.
2. Sube **el contenido de esta carpeta** a la raíz del repositorio (incluidos `.nojekyll`, `index.html`, `styles.css`, `script.js`, `config.js` y `assets/`). No subas el PDF original: contiene datos privados.
3. En **Settings > Pages > Build and deployment**, elige **Deploy from a branch** y selecciona `main` y `/ (root)`. Guarda los cambios.
4. Al terminar la publicación, la URL será `https://TU-USUARIO.github.io/lester-jhomayri-boda/`. Comprueba la apertura, las fotos, música, mapas y RSVP desde iPhone y Android, y genera el QR a partir de la URL final. Si el repositorio lleva otro nombre, adapta la URL en los ejemplos.

Los recursos se enlazan con rutas relativas, así que funcionan bajo la ruta del repositorio. HTTPS lo proporciona GitHub Pages. Las fuentes proceden de Google Fonts; si no cargan, hay fuentes de respaldo.

## Archivos

- `index.html`: estructura y textos.
- `styles.css`: diseño, sobre tridimensional, animación y estilos móviles.
- `script.js`: apertura, música, cuenta regresiva, mapas y RSVP.
- `config.js`: datos editables y enlace del formulario.
- `assets/images/`: fotos originales y gráficos del PDF optimizados para web.
- `assets/audio/`: ubicación opcional de la música autorizada.

La invitación muestra una animación reducida cuando el dispositivo solicita menos movimiento. Sin JavaScript se muestra directamente el contenido, sin apertura interactiva.
