<h1>{{ ip }}</h1>

<details>
    <pre class="language-text"><code>{{ response }}</code></pre>
</details>

<script>
export default {
    data () {
        return {
            ip: null,
            response: null,
        };
    },

    mounted () {
        fetch('/cdn-cgi/trace')
            .then((response) => response.text())
            .then((data) => {
                const [, ip] = data.match(/^ip=(.*?)$/m) || [null, 'unknown'];
                this.ip = ip;
                this.response = data;
            });
    },
};
</script>
