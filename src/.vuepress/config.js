const path = require('path');
const lodash = require('lodash');
const dotenv = require('dotenv');

// Load the environment variables both from the .env file and the process scope.
//   In case of conflicts, the process value will win.
const env = {
    ...dotenv.config().parsed,
    ...process.env,
};

module.exports = {
    title: 'Dusan’s Space',
    description: 'Testing, testing, testing...',
    base: '/',
    dest: 'dist',
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: '/favicon.ico',
            },
        ],
        [
            'meta',
            {
                name: 'theme-color',
                content: '#ff7700',
            },
        ],
        [
            'link',
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
            },
        ],
        [
            'link',
            {
                rel: 'stylesheet',
                // eslint-disable-next-line max-len
                href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Merriweather+Sans:ital,wght@0,600;1,600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap',
            },
        ],
        [
            'script',
            {
                async: true,
                src: `https://www.googletagmanager.com/gtag/js?id=${env.GA4_MEASUREMENT_ID}`,
            },
        ],
        [
            'script',
            {},
            [
                // eslint-disable-next-line max-len
                `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${env.GA4_MEASUREMENT_ID}');`,
            ],
        ],
    ],
    scss: {
        additionalData: '@import "@/theme/styles/_variables";',
    },
    configureWebpack: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, '../'),
                '@': path.resolve(__dirname, '.'),
            },
        },
    },
    chainWebpack: (config) => {
        config.module
            .rule('js')
            .use('babel-loader')
            .tap(options => Object.assign(options, {
                compact: false,
            }));
    },
    markdown: {
        anchor: {
            permalinkClass: 'Permalink',
            permalinkSymbol: '#',
        },
    },
    themeConfig: {
        env,
        logo: 'https://cdn.dvuckovic.com/images/avatar.png',
        coverHome: 'https://cdn.dvuckovic.com/images/lego_stormtrooper.jpg',
        coverError: 'https://cdn.dvuckovic.com/images/stormtroopers.jpg',
        dateFormat: 'YYYY-MM-DD',
        errorTitle: '404',
        errorDescription: 'Tear this ship apart until you find those plans!',
        ga: false,
        seo: true,
        globalPagination: {
            lengthPerPage: 9,
        },
        sitemap: {
            hostname: 'https://dvuckovic.com',
        },
        feed: {
            path: '/rss.xml',
            canonical_base: 'https://dvuckovic.com',
            posts_directories: [ '/posts/' ],
            sort: entries => lodash.reverse(lodash.sortBy(entries, 'date')),
        },
        contact: [
            {
                type: 'instagram',
                text: 'Instagram',
                link: 'https://instagram.com/dvuckovic82',
            },
            {
                type: 'github',
                text: 'GitHub',
                link: 'https://github.com/dvuckovic',
            },
        ],
        smoothScroll: true,
        paginationComponent: 'SimplePagination',
        frontmatters: [
            {
                id: 'tag',
                keys: [ 'tags' ],
                path: '/tag/',
            },
        ],
        directories: [
            {
                id: 'post',
                dirname: 'posts',
                path: '/',
                title: '',
                itemPermalink: '/:year/:month/:day/:slug',
                pagination: {
                    sorter: (prev, next) => {
                        if (prev.frontmatter.sticky) {
                            if (next.frontmatter.sticky) {
                                return prev.frontmatter.weight < next.frontmatter.weight
                                    ? -1
                                    : 1;
                            }
                            return -1;
                        }
                        if (next.frontmatter.sticky) {
                            if (prev.frontmatter.sticky) {
                                return prev.frontmatter.weight < next.frontmatter.weight
                                    ? -1
                                    : 1;
                            }
                            return 1;
                        }
                        // eslint-disable-next-line global-require
                        const moment = require('moment');
                        const prevTime = moment(prev.frontmatter.date);
                        const nextTime = moment(next.frontmatter.date);
                        return prevTime - nextTime > 0 ? -1 : 1;
                    },
                },
            },
        ],
        nav: [
            {
                text: 'Posts',
                link: '/tag/post/',
            },
            {
                text: 'Projects',
                link: '/tag/project/',
            },
            {
                text: 'Photos',
                link: '/tag/photo/',
            },
            {
                text: 'Panoramas',
                link: '/tag/panorama/',
            },
        ],
        emailModal: {
            title: 'Hey there!',
            // eslint-disable-next-line max-len
            body: '<p>The best way to get in touch with me directly is to drop me an email.</p>\n<p>My email address is my <strong>given name</strong> at this website.</p>\n<p><em>If you want to send me a secure message, you can get <a href="https://cdn.dvuckovic.com/downloads/dvuckovic.crt" class="NavLink NavLink--PublicKey" download>my S/MIME certificate</a>.</em></p><p><small><em>Or, if you prefer PGP, get <a href="https://cdn.dvuckovic.com/downloads/dvuckovic.pub" class="NavLink NavLink--PublicKey" download>my public key</a>.</em></small></p>',
            button: 'Got it!',
        },
        footer: {
            copyright: [
                {
                    text: `© ${new Date().getFullYear()} Dusan Vuckovic`,
                    link: '/',
                },
            ],
            links: [
                {
                    text: 'Email',
                    link: '#email-modal',
                    toggle: 'modal',
                },
                {
                    text: 'Privacy',
                    link: '/privacy-policy.md',
                },
                {
                    text: 'Github',
                    link: 'https://github.com/dvuckovic',
                },
            ],
            syndication: [
                {
                    text: 'Powered by VuePress',
                    link: 'https://vuepress.vuejs.org',
                    image: 'https://img.shields.io/badge/powered_by-VuePress-3eaf7c?logo=Vue.js',
                },
                {
                    text: 'Secured by Cloudflare',
                    link: 'https://www.cloudflare.com',
                    image: 'https://img.shields.io/badge/secured_by-Cloudflare-f38020?logo=cloudflare',
                },
                {
                    text: 'Licensed as WTFPL',
                    link: 'http://www.wtfpl.net',
                    image: 'https://img.shields.io/badge/license-WTFPL-white',
                },
            ],
        },
    },
};
