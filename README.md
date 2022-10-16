# dvuckovic.github.io

[![Build Status](https://img.shields.io/github/workflow/status/dvuckovic/dvuckovic.github.io/Build%20&%20Deploy)](https://github.com/dvuckovic/dvuckovic.github.io/actions/workflows/deploy.yml)
[![Powered by VuePress](https://img.shields.io/github/package-json/dependency-version/dvuckovic/dvuckovic.github.io/dev/vuepress)](https://vuepress.vuejs.org)
[![License](https://img.shields.io/github/package-json/license/dvuckovic/dvuckovic.github.io?color=white)](http://www.wtfpl.net/)

VuePress instance for the website [Dusan’s Space](https://dvuckovic.com).

## Installation

### Dependencies

```sh
npm install --no-save --legacy-peer-deps
```

### Setup Environment

Create the `.env` file in the root folder, and set the following variables:

```
GOOGLE_MAPS_API_KEY=<your_google_maps_javascript_api_key>
GOOGLE_ANALYTICS_ID=<your_google_analytics_id>
GA4_MEASUREMENT_ID=<your_google_analytics_4_measurement_id>
OBJECT2VR_PLAYER=<url_to_object2vr_player_lib>
RECAPTCHA_SITE_KEY=<your_recaptcha_site_key>
```

Links:
* [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials/)
* [Google Analytics Web](https://analytics.google.com/analytics/web/)
* [Object2VR](https://ggnome.com/object2vr/)
* [Google reCAPTCHA v3 Admin Console](https://www.google.com/recaptcha/admin/)

## Development Server

```sh
npm run serve
```

## Linting

```sh
npm run lint
```

## Production Server

```sh
npm start
```

### Build for Production

```sh
npm run build
```

### Serve Production Build

```sh
npx wrangler pages dev dist
```

## Testing

```sh
npm test
```

### Unit Tests

```sh
npm run test:unit
```

### End-to-end Tests

```sh
npm run test:e2e
```
