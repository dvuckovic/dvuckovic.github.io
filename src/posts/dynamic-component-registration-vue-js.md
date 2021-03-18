---
title: Dynamic Component Registration in Vue.js
image: https://cdn.dvuckovic.com/posts/vue-dynamic-component-registration.jpg
summary: Keeping tabs on dynamic components in module layers
date: 2021-02-08
tags:
  - post
  - vue
  - webpack
  - javascript
readingTime: 30 minutes
---

Vue.js framework has an awesome feature called [dynamic components](https://vuejs.org/v2/guide/components.html#Dynamic-Components) that allows for a very easy way of building front end module layers. A module layer in this case pertains to a modular and dynamic loading of specific component depending on some configuration or user choice. It’s a staple in bigger applications that bundle their features in form of add-on modules that normally only ship new files or additional configuration.

## Use Cases

Dynamic components are a pretty flexible paradigm, but the most common use cases could be:

* Tab components (similar to the example outlined in [the Vue Guide](https://vuejs.org/v2/guide/components.html#Dynamic-Components))
* Form fields (usable by forms rendered from a supplied schema)
* Content renderers (based on a content type)
* Etc.

Actually, any subsystem can be turned into a front end module layer, but the question is do you really need it for a specific place? It’s always bet to start with hardcoded components, and implement a layer if the need arises later.

## Dynamic Components in Vue

Components in Vue can be dynamically mounted in a very simple fashion, using the `<component>` element with its special `is` attribute, like so:

```vue
<template>
    <div id="app">
        <component v-bind:is="componentName" />
    </div>
</template>

<script>
export default {
    computed: {
        componentName () {
            // This list does not have to be hardcoded,
            //   we can also fetch it from a server, for example.
            const componentNames = [
              'ComponentA',
              'ComponentB',
              'ComponentC',
              'ComponentD',
              'ComponentE',
            ];

            // For sake of simplicity, we are just returning
            //   a random component name here.
            return componentNames[Math.floor(Math.random() * componentNames.length)];
        },
    },
};
</script>
```

The value of the `is` attribute can be either _the registered component name_ in the current scope, or _the component object_. For purposes of this guide, we will limit ourself to the registered component name approach.

## The Registration Conundrum

Obviously, for the above code to work, you must make sure that all of possible components are registered properly, using one of the available approaches.

In case we use the `components` registration hash with dynamic imports in Webpack, this can be done in the following way:

```vue
<script>
export default {
    components: {
        ComponentA: () => import ('./components/dynamic/ComponentA'),
        ComponentB: () => import ('./components/dynamic/ComponentB'),
        ComponentC: () => import ('./components/dynamic/ComponentC'),
        ComponentD: () => import ('./components/dynamic/subdir/ComponentD'),
        ComponentE: () => import ('./components/dynamic/subdir/ComponentE'),
    },
};
</script>
```

This can get ugly pretty fast. What if you intend to extend the list of components with add-on code? Wouldn’t this require you touch the host file each time too, so you can extend the registration hash?

Yeah, probably.

However, there is a way to make this registration hash dynamically populated, and extend it on the fly, just by reading available files in a specific folder at _build time_.

## Generate the Component Index

First, we need to write a function to traverse the directory containing our component files, and return a data array we can go over later in our application.

Luckily, this is pretty easy to compose in JavaScript, using some high-level Node.js APIs (shamelessly adapted from [this StackOverflow answer](https://stackoverflow.com/a/46391945)):

```js
const path = require('path');
const fs = require('fs');

const traverseDirectory = (dir, result = [], topDir = dir) => {
    fs.readdirSync(dir).forEach((fileName) => {
        const absolutePath = path.resolve(dir, fileName);
        const relativePath = path.relative(topDir, absolutePath);

        const fileStats = {
            fileName,
            relativePath,
        };

        // Traverse a sub directory via recursion.
        if (fs.statSync(absolutePath).isDirectory()) {
            fileStats.files = [];
            result.push(fileStats);
            return traverseDirectory(absolutePath, fileStats.files, topDir);
        }

        result.push(fileStats);
    });

    return result;
};

const componentDir = path.resolve(__dirname, './components/dynamic');

module.exports = traverseDirectory(componentDir);
```

As the final result, the exported variable will contain the complete directory index of files & folders under the specified path (in this case `./components/dynamic` is relative to the source root).

## Configure the Webpack Define Plugin

Once we have the directory index at our disposal, all we need to do is include it in the build by using a special Webpack plugin suitably called the `Define`.

In case your project uses the excellent [@vue/cli](https://cli.vuejs.org/) tooling, extending the Webpack configuration will be a breeze.

All you need to do is create the `vue.config.js` file in the root of your project (unless you already have it), and add the code below to it:

```js
const webpack = require('webpack');
const componentIndex = require('./src/component-index');

module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.env.COMPONENT_INDEX': JSON.stringify(componentIndex),
            }),
        ],
    },
};
```

You can see we are requiring the component index function we composed above. The `Define` plugin’s story is pretty simple: it injects a global constant with the supplied value into the final app build. The constant is accessible from the source code via the `process.env.COMPONENT_INDEX` namespace. That’s all there is to it!

_NOTE: The directory index will be generated only at the start of the development server or the build time of the production app. In other words, Hot Module Replacement (HMR) is NOT supported. In case you add or remove files from the specified directory, you will need to restart the server or rebuild the app to regenerate the index._

## Putting it All Together

Back in our Vue app, we can now take advantage of the supplied global constant and process it further in order to create a suitable component registration hash. We can do this by going over the component index and filtering it for any Vue files:

```js
import path from 'path';

const getDynamicComponentRegistration = (componentIndex, componentRegistration = {}) => {
    componentIndex.forEach((fileStats) => {
        // Process only sub-directories and the Vue component files (*.vue).
        if (
            !fileStats.files
            && !path.extname(fileStats.fileName) === '.vue'
        ) {
            return;
        }

        // Process subdirectories recursively.
        if (fileStats.files) {
            return getDynamicComponentRegistration(fileStats.files, componentRegistration);
        }

        let componentName = path.basename(fileStats.fileName, '.vue');

        // Include the component in the registration hash, using its relative path.
        //   Make sure that the component directory referenced below is the same one used to generate
        //   the component index from in the Webpack configuration!
        componentRegistration[componentName] = () => import(`./components/dynamic/${fileStats.relativePath}`);
    });

    return componentRegistration;
};

export default getDynamicComponentRegistration;
```

The result of the above function can be used as the component registration hash, like so:

```vue
<script>
import getDynamicComponentRegistration from './component-registration';

export default {
    components: getDynamicComponentRegistration(process.env.COMPONENT_INDEX),
};
</script>
```

Or, in case you already have some components you would like to register, you can use the handy [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to merge the two objects:

```vue
<script>
import HelloWorld from './components/HelloWorld';
import getDynamicComponentRegistration from './component-registration';

export default {
    components: {
        HelloWorld,
        ...getDynamicComponentRegistration(process.env.COMPONENT_INDEX),
    },
};
</script>
```

## Caveats

As you have probably noticed, there are a couple of caveats with this approach:

* All component names must be unique for the module layer. However, you should already be doing this in case you are following the recommended Vue style guide regarding [the component names](https://vuejs.org/v2/style-guide/#Multi-word-component-names-essential).

* Webpack Hot Module Replacement (HMR) will not kick in when new files are copied to the module layer directory. In this case full reload/rebuild will be required, because the index will be generated at build time.

* The paths to the module layer directory must be specified in several places in the code, and kept in sync. Unfortunately, there is no way around it, because Webpack dependencies must be imported relative to project directories. After all, it uses the static analysis of the code to bundle all dynamic imports.

* Webpack build progress might regress a bit once it encounters the module layer directory, because it will have to go through all files to it. This results in some _funny_ back and forth progress bar percentages, which is unavoidable.

However, the approach is sound, and already battle tested in several apps I worked on. Further improvements are also possible, especially in case you need multiple module layers in the same application. While the index can stay single, it is possible to filter it for different base paths, and only return a certain set of components relevant for the current scope.

## Source Code

Complete [source code](https://github.com/dvuckovic/vue-dynamic-component-registration) for this example is released under the [WTFPL license](http://www.wtfpl.net/). Feel free to let me know if you base something on it, happy coding!
