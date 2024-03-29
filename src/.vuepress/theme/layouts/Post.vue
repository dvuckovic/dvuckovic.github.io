<template>
    <article
        class="container-lg px-3 Post"
        itemscope
        itemtype="https://schema.org/BlogPosting">
        <div class="row justify-content-center">
            <header
                id="header"
                class="col-md-9 Post__Header">
                <ul
                    v-if="$frontmatter.tags"
                    class="d-flex flex-row mb-2 list-unstyled Post__Meta Post__Meta--Tags"
                    itemprop="keywords">
                    <PostTag
                        v-for="tag in resolvedTags"
                        v-bind:key="tag"
                        v-bind:tag="tag" />
                </ul>
                <h1
                    class="Post__Title"
                    itemprop="name headline">
                    {{ $frontmatter.title }}
                </h1>
                <p
                    class="mt-4 mb-4 Post__Summary"
                    itemprop="description">
                    {{ $frontmatter.summary }}
                </p>

                <footer>
                    <div
                        v-if="$frontmatter.author"
                        class="d-none"
                        itemprop="publisher author"
                        itemtype="http://schema.org/Person"
                        itemscope>
                        <span itemprop="name">
                            {{ $frontmatter.author }}
                        </span>
                    </div>

                    <div
                        v-if="$frontmatter.date"
                        class="text-uppercase Post__Meta Post__Meta--Date">
                        <time
                            itemprop="datePublished"
                            v-bind:datetime="$frontmatter.date">
                            {{ resolvePostDate($frontmatter.date) }}
                        </time>
                        <template v-if="$frontmatter.readingTime">
                            <span class="mx-2">
                                &bullet;
                            </span>
                            {{ $frontmatter.readingTime }}
                        </template>
                    </div>
                </footer>
            </header>
        </div>

        <div class="row">
            <figure
                v-if="$frontmatter.image && !$frontmatter.hideImage"
                class="col Post__FullImage">
                <img
                    v-bind:src="$frontmatter.image"
                    v-bind:alt="$frontmatter.title"
                    sizes="(max-width: 800px) 400px, (max-width: 1170px) 1170px, 2000px"
                    class="rounded w-100">
            </figure>
        </div>

        <div class="row justify-content-center">
            <section
                class="col-md-9"
                itemprop="articleBody">
                <Content class="Post__Content" />
            </section>
        </div>

        <div class="row">
            <section
                class="col"
                itemprop="articleBody">
                <Content
                    class="Post__Content"
                    slot-key="wide" />
            </section>
        </div>

        <Toc class="position-fixed Toc" />
    </article>
</template>

<script>
import PostTag from '@theme/components/PostTag';
import Toc from '@theme/components/Toc';
import moment from 'moment';
import zoom from 'medium-zoom';

export default {
    components: {
        PostTag,
        Toc,
    },

    data () {
        return {
            previousScrollPosition: 0,
            mediumZoom: null,
        };
    },

    computed: {
        resolvedTags () {
            if (!this.$frontmatter.tags || Array.isArray(this.$frontmatter.tags)) {
                return this.$frontmatter.tags;
            }

            return [ this.$frontmatter.tags ];
        },
    },

    mounted () {
        window.addEventListener('scroll', this.onScrollPosition);
        this.initMediumZoom();
    },

    updated () {
        this.initMediumZoom();
    },

    beforeDestroy () {
        window.removeEventListener('scroll', this.onScrollPosition);
    },

    methods: {
        resolvePostDate (date) {
            return moment(date).format(this.$themeConfig.dateFormat || 'ddd MMM DD YYYY');
        },

        initMediumZoom () {
            this.$nextTick(() => {
                if (this.zoom) this.zoom.detach();
                this.zoom = zoom('.Post__Content :not(a) > img:not([src*="#nozoom"])');
            });
        },
    },
};
</script>

<style lang="scss">
.Post {
    &__Header {
        padding-top: 70px;
        padding-bottom: 50px;

        @media (max-width: 992px) {
            padding-top: 50px;
            padding-bottom: 40px;
        }

        @media (max-width: 768px) {
            padding-top: 20px;
            padding-bottom: 30px;
        }
    }

    &__Title {
        font-size: 2.25rem;

        @media (min-width: 768px) {
            font-size: 3rem;
        }

        @media (min-width: 992px) {
            font-size: 3.5rem;
        }
    }

    &__Summary {
        color: $spanish;
        font-family: 'Merriweather', serif;
        font-weight: 300;
        font-size: 1.125rem;

        @media (min-width: 768px) {
            font-size: 1.3125rem;
        }

        @media (min-width: 992px) {
            font-size: 1.4375rem;
        }
    }

    &__Meta {
        &--Tags {
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.2px;

            a {
                color: $primary;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        &--Date {
            font-size: 0.75rem;
            font-weight: 500;
            color: $spanish;
            letter-spacing: 0.2px;
        }
    }

    &__FullImage {
        margin-bottom: 30px;
    }

    &__Content {
        padding-bottom: 50px;
        font-family: 'Merriweather', serif;
        font-size: 1rem;

        @media (min-width: 768px) {
            font-size: 1.125rem;
        }

        @media (min-width: 992px) {
            font-size: 1.25rem;
        }

        @media (max-width: 992px) {
            padding-bottom: 50px;
        }

        @media (max-width: 768px) {
            padding-bottom: 30px;
        }

        &:empty {
            display: none;
        }

        a {
            color: $primary;

            &:hover {
                text-decoration: underline;
            }

            & > span > .icon.outbound {
                color: $silver;
                margin-left: 4px;

                &:hover {
                    color: $primary;
                }
            }
        }

        em,
        strong {
            color: $white;
        }

        img {
            max-width: 100%;
            display: block;
            margin: 0 auto;
            border-radius: 0.25em;

            & + span > .icon.outbound {
                color: $silver;
                float: right;
                margin-right: -20px;
                margin-top: -15px;

                &:hover {
                    color: $primary;
                }
            }

            &[src*='#invert'] {
                filter: invert(100%);
                border-radius: 0;
            }

            &[src*='#rect'] {
                border-radius: 0;
            }

            &[src*='#icon'] {
                float: left;
                margin-left: -70px;

                @media (max-width: 767px) {
                    & {
                        display: none;
                    }
                }
            }

            &[src*='#half'] {
                float: left;
                width: 48%;
                margin-right: 2%;
                margin-bottom: 15px;
            }
        }

        h2,
        h3,
        h4,
        h5,
        h6 {
            color: $cultured;
            margin-top: 1em;
        }

        code {
            color: $white;
            background: $rich;
            font-weight: 400 !important;
            border-radius: 0.25em;
        }

        li,
        p {
            code {
                padding: 0 5px 2px;
            }
        }

        pre {
            font-size: 0.875rem;
            margin: 21px 0;
            color: $cultured;
            background: $rich;
            border-radius: 0.25em;
        }

        pre ::selection {
            color: $white;
            background: $primary;
        }

        table {
            border-spacing: 0;
            border-collapse: collapse;
            display: inline-block;
            margin: 16px 0 32px;
            max-width: 100%;
            width: auto;
            border-spacing: 0;
            border-collapse: collapse;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            vertical-align: top;

            td {
                font-size: 1rem;
            }

            td:first-child {
                text-align: center;
            }

            td:last-child {
                background-image: linear-gradient(270deg, $white 50%, hsla(0, 0%, 100%, 0));
                background-position: 100% 0;
                background-size: 20px 100%;
                background-repeat: no-repeat;
            }

            th {
                color: $rich;
                font-size: 0.75rem;
                font-weight: 600;
                letter-spacing: .2px;
                text-align: center;
                text-transform: uppercase;
                background-color: $white;
            }

            td,
            th {
                padding: 6px 12px;
                border: 1px solid $cultured;
            }

            td:first-child {
                background-image: linear-gradient(90deg, $jet 50%, rgba(25, 27, 31, 0));
            }

            td:last-child {
                background-image: linear-gradient(270deg, $jet 50%, rgba(25, 27, 31, 0));
            }

            th {
                color: hsla(0, 0%, 100%, .85);
                background-color: $davys;
            }

            td,
            th {
                border: 1px solid $davys;
            }
        }

        blockquote {
            padding-left: 0.75rem;
            border-left: 7px solid $spanish;
            color: $battleship;
        }
    }
}

.medium-zoom {
    &-overlay {
        background: $black !important;
        z-index: 1020;
    }

    &-image {
        z-index: 1020 !important;
    }
}
</style>
