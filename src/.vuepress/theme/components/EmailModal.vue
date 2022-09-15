<!-- eslint-disable vue/no-v-html -->

<template>
    <div
        id="email-modal"
        ref="emailModal"
        class="modal fade"
        tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2
                        class="modal-title"
                        v-html="$themeConfig.emailModal && $themeConfig.emailModal.title" />
                </div>
                <div class="modal-body">
                    <p>{{ $themeConfig.emailModal.intro }}</p>
                    <template v-if="isSuccess">
                        <p class="text-center">
                            <a v-bind:href="`mailto:${emailAddress}`">
                                {{ emailAddress }}
                            </a>
                        </p>
                        <p v-html="$themeConfig.emailModal.keys" />
                    </template>
                    <template v-else-if="isError">
                        <p class="text-center">
                            <small class="text-warning">{{ $themeConfig.emailModal.error }}</small>
                        </p>
                        <button
                            type="button"
                            class="btn btn-secondary d-block mx-auto mb-3"
                            v-on:click="isError = false">
                            {{ $themeConfig.emailModal.retry }}
                        </button>
                    </template>
                    <button
                        v-else
                        type="button"
                        class="btn btn-secondary d-block mx-auto mb-3"
                        v-on:click="revealEmail">
                        {{ $themeConfig.emailModal.reveal }}
                    </button>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal">
                        {{ $themeConfig.emailModal.button }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            response: null,
            isSubmitting: false,
            isSuccess: false,
            isError: false,
        };
    },

    computed: {
        emailAddress () {
            return `${atob(this.response.USER)}\u0040${atob(this.response.HOST)}\u002e${atob(this.response.TLD)}`;
        },
    },

    mounted () {
        this.$refs.emailModal.addEventListener('show.bs.modal', this.injectRecaptchaScript, { once: true });
    },

    beforeDestroy () {
        this.$refs.emailModal.removeEventListener('show.bs.modal', this.injectRecaptchaScript);
    },

    methods: {
        injectRecaptchaScript () {
            const recaptchaScript = document.createElement('script');
            recaptchaScript.setAttribute(
                'src',
                `https://www.google.com/recaptcha/api.js?render=${this.$env.RECAPTCHA_SITE_KEY}`
            );
            document.head.appendChild(recaptchaScript);
        },

        async revealEmail () {
            this.isSubmitting = true;
            this.isSuccess = false;
            this.isError = false;

            try {
                const token = await grecaptcha.execute(this.$env.RECAPTCHA_SITE_KEY, { action: 'reveal' });

                const body = new FormData();
                body.set('g-recaptcha-response', token);

                const res = await fetch('/api/reveal', {
                    method: 'POST',
                    body,
                });

                if (res.status === 200) {
                    this.response = await res.json();
                    this.isSuccess = true;
                }
                else {
                    console.warn('Error!', res);
                    this.isError = true;
                }
            }
            catch (error) {
                console.warn(error);
                this.isError = true;
            }
            finally {
                this.isSubmitting = false;
            }
        },
    },
};
</script>

<style lang="scss">
.grecaptcha-badge {
    display: none !important;
    z-index: 1060;
}

.modal-open {
    .grecaptcha-badge {
        display: block !important;
    }
}
</style>
