# Cloud Mesh · Particle Nebula

![Cloud Mesh feature preview](docs/screenshot.png)

[简体中文](README.md) · **English**

An interactive WebGL particle field with live controls. Explore particles, trails, ripples, and perspective through Nebula, Halo, and Galaxy presets.

**[Live demo →](https://particle-orbit-studio.justvine11.chatgpt.site/)**

## Features

- **Three presets:** Nebula, Halo, and Galaxy, with a reset to the original settings.
- **Live controls:** particle count, size, brightness, depth, time scale, and scene time.
- **Trails and ripples:** independent visibility, speed, and opacity controls, with a shared 2D color pad, hue strip, and HEX input.
- **Camera interaction:** drag to rotate and scroll to zoom; adjust framing, angles, and depth of field.
- **Visibility and playback:** hide particles while retaining trails and ripples; pause and resume the animation.
- **Themes and languages:** dark / light themes and Chinese / English UI. Each page load starts in Chinese.
- **Configuration and export:** import / export JSON settings and save PNG images.
- **Interface:** a floating frosted settings panel, spring-style disclosure animations, and icon controls.

The manual particle limit is 100,000. The default uses the original adaptive density with a 32,000 limit. Actual density, performance, and depth of field depend on the device and canvas size.

## Run locally

No npm installation or build step is required. With Python 3 installed, run from the project root:

```sh
python3 -m http.server 8765 --directory dist
```

Open <http://localhost:8765/>. Serve the files over HTTP rather than opening the HTML directly. A WebGL-capable browser is required.

## Use as a module

Deploy the runtime files from `dist/` together, load `style.css`, and give the host element explicit dimensions:

```js
import { CloudMesh } from './mesh.js';

const mesh = new CloudMesh(document.querySelector('#scene'));
mesh.set({ size: 1.2, animate: false });
// Release rendering resources when finished.
mesh.destroy();
```

See `defaults` in [`dist/mesh.js`](dist/mesh.js) for the full configuration. `morph` represents scene time in seconds.

## Project structure

```text
dist/
  index.html       Page structure
  boot.js          Loading state and initialization
  app.js           Controls, interactions, and configuration
  i18n.js          Chinese / English interface
  style.css        Themes and layout
  mesh.js          Particle field wrapper
  vendor/original.js  Extracted third-party rendering runtime
docs/screenshot.png
```

For static hosting, publish `dist/`. GPU detection requests `cdn.openai.com/webgl/detect-gpu` and uses a fallback profile if that request fails.

## Attribution and licensing

The particle effect originates from [this OpenAI page](https://openai.com/index/hugging-face-incident-and-the-road-ahead/). This project retains extracted scene, shader, ripple, and postprocessing logic, adding an independent settings interface and interaction wrapper. It is not affiliated with or endorsed by OpenAI.

Original interface and wrapper code in this project is available under the [MIT License](LICENSE). **That license does not cover third-party code in `dist/vendor/original.js`.** Redistribution and usage rights for that code have not been verified; the complete runtime must not be treated as entirely MIT-licensed. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for provenance.
