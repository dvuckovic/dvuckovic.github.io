---
title: Vue Bootstrap Icons
image: https://cdn.dvuckovic.com/projects/vue-bootstrap-icons.jpg
summary: A Vue.js component for rendering Bootstrap Icons via the SVG sprite method
date: 2021-03-12
tags:
  - project
  - vue
  - component
  - bootstrap
readingTime: 30 minutes
---

The official [Bootstrap Icons](https://icons.getbootstrap.com/) are finally here, and they are beautiful! Very clean strokes, and (the best part) applicable to so many designs and use-cases, exactly as [the framework](https://getbootstrap.com/) itself.

Unfortunately, it was decided not to cater for too many environments, possibly because of the perceived overhead, so their usage instructions are quite simplistic and low-level at this time. I set out to see how complex it would be to create a Vue component for the icons, read on for the results.

## SVG Conundrum

Obviously, the icons themselves are shipped in separate SVG files, kinda what you expect for a serious symbols library nowadays. However, SVGs are notorious for their usage on the web, it’s quite far from a good dev UX, mind you. It’s great when you can use them in a project, but moving away from webfont based icon packs is still a chore. Especially if you need some dynamic properties, i.e. not knowing at build time which icons you will be using, only at runtime.

Fortunately, Bootstrap Team did offer couple of approaches in their [Usage](https://icons.getbootstrap.com/#usage) section of the documentation, and what caught my eyes was the _sprite_ method. Basically, a very large sprite map is generated that includes all icons, so you get your one and only request for good caching performance. Then you just need to decide which element in the map you want to render, and you’re good to go.

## Existing Solutions

Although the library is quite young, there are already a [couple](https://www.npmjs.com/package/bootstrap-vue) [of](https://www.npmjs.com/package/bootstrap-icons-vue) [packages](https://www.npmjs.com/package/vue-bootstrap-icons) out there that address a similar need. However, I found that none of them was based on the sprite method, and they opted for importing every icon on its own for tree-shaking reasons.

For sure, this is the best option, but only when you can afford it. Again, what if you don’t know which icons will be needed at build time? You still need to import all of them at some point, but normally they will still be considered as separate resources and might result in separate requests for each icon usage. _Yikes!_

## NPM Package

Naturally, I decided to create my own component, and try to package and publish it to the [NPM](https://www.npmjs.com) at the same time, so it can easily be used across different projects. The results can be found in two packages, for each Vue flavor of your choice:

* [Vue 2](https://www.npmjs.com/package/@dvuckovic/vue-bootstrap-icons)
* [Vue 3](https://www.npmjs.com/package/@dvuckovic/vue3-bootstrap-icons)

### Install

To install the library, you can execute the following command in your project folder:

```sh
npm install --save-prod @dvuckovic/vue-bootstrap-icons
# or
npm install --save-prod @dvuckovic/vue3-bootstrap-icons
```

### Usage

Before the use, register the component either globally or locally in Vue 2:

```js
import Vue from 'vue';
import BootstrapIcon from '@dvuckovic/vue-bootstrap-icons';

// Global component registration.
Vue.component('BootstrapIcon', BootstrapIcon);

// Or...

export default {
    components: {
        // Local component registration.
        BootstrapIcon,
    },
};
```

For Vue 3, the registration is slightly different:

```js
import Vue from 'vue';
import BootstrapIcon from '@dvuckovic/vue3-bootstrap-icons';

const app = Vue.createApp({});

// Global component registration.
app.component('BootstrapIcon', BootstrapIcon);

app.mount('#app);

// Or...

import { defineComponent } from 'vue';
import BootstrapIcon from '@dvuckovic/vue3-bootstrap-icons';

export default defineComponent({
    components: {
        // Local component registration.
        BootstrapIcon,
    },
});
```

Then, simply include the following code in the template:

```vue live
<BootstrapIcon
    icon="bootstrap-fill"
    variant="light"
    size="3x" />
```

Icons are rendered according to the name passed via the `icon` prop, you can consult [the official docs](https://icons.getbootstrap.com/#icons) for their valid _kebab-names_.

Above I included only some props, for a full list of possibilities you can check out [the readme file](https://github.com/dvuckovic/vue-bootstrap-icons#props). Feel free to play around with the example above, it’s _live_ code!

### Problems and New Features

If you find any problems or want to propose new features, feel free to submit an issue or a pull request on Github. Note that there are two flavors of the package, make sure to cater to both:

* [Vue 2](https://github.com/dvuckovic/vue-bootstrap-icons)
* [Vue 3](https://github.com/dvuckovic/vue3-bootstrap-icons)

## Source Code

Complete source code for this component was written in Vue.js and bundled via [rollup](https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html). Source code is released under the [WTFPL license](http://www.wtfpl.net/).
