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
    title: 'Blog Title',
    description: 'Blog description.',
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
        logo: 'https://vuepress.vuejs.org/hero.png',
        coverHome: 'https://source.unsplash.com/random/2048x1024',
        coverError: 'https://source.unsplash.com/random/2048x1024',
        dateFormat: 'YYYY-MM-DD',
        errorTitle: '404',
        errorDescription: 'Not Found',
        ga: false,
        seo: true,
        globalPagination: {
            lengthPerPage: 4,
        },
        sitemap: {
            hostname: 'https://example.com',
        },
        feed: {
            path: '/rss.xml',
            canonical_base: 'https://example.com',
            posts_directories: [ '/posts/' ],
            sort: entries => lodash.reverse(lodash.sortBy(entries, 'date')),
        },
        contact: [
            {
                type: 'github',
                text: 'Github',
                link: 'https://github.com',
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
                text: 'Static',
                link: '/static-page',
            },
        ],
        emailModal: {
            title: 'Hey there!',
            // eslint-disable-next-line max-len
            body: '<p>The best way to get in touch with me directly is to drop me an email.</p>\n<p>My email address is <a href="mailto:test@example.com">test@example.com</a></p>',
            button: 'Got it!',
        },
        footer: {
            copyright: [
                {
                    text: `© ${new Date().getFullYear()}`,
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
                    text: 'Github',
                    link: 'https://github.com',
                },
            ],
            syndication: [
                {
                    text: 'Powered by VuePress',
                    link: 'https://vuepress.vuejs.org',
                    image: 'https://img.shields.io/badge/powered_by-VuePress-3eaf7c?logo=Vue.js',
                },
            ],
        },
    },
};
