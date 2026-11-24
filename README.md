# TFS Developers Studio

Sitio profesional de TFS Developers Studio, independiente de TC/STUDIO. La identidad está inspirada en el monograma geométrico TFS plateado y violeta. El logo vectorial, contenido de marca, servicios, equipo y casos editables están en `public/brand` y `src/content.js`.

## Desarrollo

Requiere Node.js 22.12 o superior.

```sh
npm install
npm run dev
```

La vista local se sirve en `http://127.0.0.1:8780/`.

## Movimiento y tipografía

En escritorio, GSAP + ScrollTrigger controlan la cámara del inicio y la profundidad de los casos; Lenis suaviza el desplazamiento. En pantallas pequeñas no se fija el hero y el scroll se mantiene nativo. Si el sistema pide movimiento reducido, la secuencia se desactiva. Las fuentes Barlow Condensed, Space Grotesk e IBM Plex Mono están guardadas localmente con sus licencias OFL.

## Casos migrados

- TCGym, con React, Node.js, Express y MySQL documentados en su caso local.
- Portal Pediatría, con captura pública del portal y descripción disponible.
- Facility Management, mostrando únicamente la pantalla pública.
- Izipark, identificado como proyecto en desarrollo y con detalles pendientes de confirmar.
- Wheelahorra, plataforma de pedidos de cercanía sobre Odoo para Wheelwright y localidades fuera de cobertura de las grandes apps.

Los recursos gráficos de estos casos se copiaron del portfolio original y de las capturas compartidas para Wheelahorra. Los perfiles enlazan a los portfolios personales confirmados de Tobías y Santino; no se atribuyen cargos ni tecnologías no confirmados.

## Recursos tipográficos

Barlow Condensed, Space Grotesk e IBM Plex Mono se sirven localmente para evitar solicitudes de fuentes externas al visitar la página. Sus licencias OFL se incluyen en `public/fonts`.

## Límites conocidos

- El perfil de Felipe requiere una URL personal y datos confirmados antes de agregar nuevos detalles.
- Los casos de Pediatría e Izipark requieren confirmar tecnologías antes de publicarlas.
- El formulario prepara una consulta en el cliente de correo; no almacena ni envía datos en un servidor.
- El email de contacto está centralizado en `src/content.js` y puede cambiarse antes de publicar.
- Las animaciones requieren `gsap` y `lenis`, declaradas como dependencias de ejecución. Se desactivan con `prefers-reduced-motion`.
