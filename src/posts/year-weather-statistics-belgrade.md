---
title: A year of weather statistics for Belgrade
image: https://cdn.dvuckovic.com/posts/mammatus_header.jpg
summary: Visual analysis of the collected weather dataset
date: 2012-07-24
tags:
  - post
  - meteorology
  - linux
  - ubuntu
readingTime: 15 minutes
---

Exactly one year ago, I made a PHP script to retrieve weather data from national weather service website ([RHMZ](http://www.hidmet.gov.rs). I put it to my always-on home server, and set it up to run _every hour_, which coincides with their updates. Result is a comprehensive data set for several cities in my country, which can be used for additional analysis.

## Background

Why, you may ask? Well, my wife landed a job there at the same time (she is a meteorologist), and she didn’t know how to fetch this data on demand. The Service does have departments which deals with this type of data gathering and storing, but the path to obtaining it was anything but obvious. Since this data can be used for weather forecast verification, we anticipated the need for it later and I went to set up a simple local database.

Script was written in PHP, which emulates a browser request to the page which hosts a table with recent measurements. It then parses this table to gather weather data for several cities and store it in a simple CSV text file. Additional script runs each day and converts this table to Excel format (using excellent [PHPExcel](http://phpexcel.codeplex.com/) library), compresses it and uploads it to a web server for sharing. I used cron to setup these tasks, and even implemented error control (server notifies me by e-mail if something goes wrong, and trust me, it often does).

## Data

We agreed to monitor and retrieve data for following cities in Serbia:

* Belgrade (Beograd)
* Kragujevac
* Niš
* Novi Sad
* Zlatibor

Following weather data was gathered:

* Date/Time (or Timestamp)
* Temperature (in degrees Celsius)
* Atmospheric pressure (in hPa)
* Wind direction
* Wind speed (m/s)
* Relative humidity (%)
* Heat index
* Weather description (clear, cloudy, etc)

## Result

While I waited for some professional to make use of this data, I wondered if I could represent the data from last year for _Belgrade_ on this page. Cue [Chart.js](https://www.chartjs.org/), simple yet flexible JavaScript charting library. It enables you to visualize data quite easily. Let’s take a look at all temperature values (8791 points!) in _Belgrade_ by timestamps.

<TimeChart
    v-bind:data="tempData"
    v-bind:labels="tempLabels" />

Next, from the same dataset, here is the average temperature with maximum and minimum values by days.

<TimeChart
    v-bind:data="aggTempData"
    v-bind:labels="aggTempLabels" />

Then, aggregation by wind direction, using a pie chart. We can see that the prevailing wind in _Belgrade_ last year was of southeast (SE) direction (also known as _Košava_).

<PolarAreaChart
    v-bind:data="windData"
    v-bind:labels="windLabels" />

If you want to know what type of weather was dominant last year in _Belgrade_, you just have to look at next chart. Apparently clear skies (_vedro_).

<DoughnutChart
    v-bind:data="descData"
    v-bind:labels="descLabels" />

You can download the data [here](https://cdn.dvuckovic.com/downloads/belgrade.csv), as a simple and self-explanatory CSV file. If you have an idea how to use or analyze it, just go for it :)

<small>_Data courtesy of [RHMZ](http://www.hidmet.gov.rs/ciril/osmotreni/index.php)_</small><br />
<small>_Photo supplied by Gaga, thanks!_</small>

<script>
import moment from 'moment';
import { parse } from 'papaparse';

export default {
    data() {
        return {
            tempData: null,
            tempLabels: [
                'Temperature (°C)',
            ],
            aggTempData: null,
            aggTempLabels: [
                'Maximum Temperature (°C)',
                'Minimum Temperature (°C)',
                'Average Temperature (°C)',
            ],
            windData: null,
            windLabels: [
                'N',
                'NE',
                'E',
                'SE',
                'S',
                'SW',
                'W',
                'NW',
            ],
            descData: null,
            descLabels: null,
        };
    },

    beforeMount () {
        parse('https://cdn.dvuckovic.com/downloads/belgrade.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Get temperature series.
                const tempData = results.data.map((row) => ({
                    t: moment(row.Timestamp, 'M/D/YY H:mm').format('YYYY-MM-DD HH:mm'),
                    y: row['Temperature (degC)'],
                }));

                // Prepare temperature series.
                this.tempData = [tempData];

                // Aggregate temperature data.
                const aggTemp = results.data.reduce((result, row) => {
                        if (!result[row.Date]) {
                            result[row.Date] = {
                                avg: row['Temperature (degC)'],
                                min: row['Temperature (degC)'],
                                max: row['Temperature (degC)'],
                            };
                        }
                        else {
                            result[row.Date].min = row['Temperature (degC)'] < result[row.Date].min ? row['Temperature (degC)'] : result[row.Date].min;
                            result[row.Date].max = row['Temperature (degC)'] > result[row.Date].max ? row['Temperature (degC)'] : result[row.Date].max;
                            result[row.Date].avg = (result[row.Date].max + result[row.Date].min) / 2;
                        }
                        return result;
                    }, {})

                // Get average temperature series.
                const avgTempData = Object.keys(aggTemp)
                    .map((date) => ({
                        t: moment(date).format('YYYY-MM-DD'),
                        y: aggTemp[date].avg,
                    }));

                // Get minimum temperature series.
                const minTempData = Object.keys(aggTemp)
                    .map((date) => ({
                        t: moment(date).format('YYYY-MM-DD'),
                        y: aggTemp[date].min,
                    }));

                // Get maximum temperature series.
                const maxTempData = Object.keys(aggTemp)
                    .map((date) => ({
                        t: moment(date).format('YYYY-MM-DD'),
                        y: aggTemp[date].max,
                    }));

                // Prepare aggregate temperature series.
                this.aggTempData = [
                    maxTempData,
                    minTempData,
                    avgTempData,
                ];

                // Get wind direction data.
                const windDirectionData = results.data.reduce((result, row) => {
                        result[row['Wind direction']] = result[row['Wind direction']] ? result[row['Wind direction']] + 1 : 1;
                        return result;
                    }, {});

                // Delete calm direction.
                delete windDirectionData['-'];
                delete windDirectionData.wN;

                // Prepare wind direction data.
                const windData = [];
                this.windLabels.forEach((direction) => {
                    windData.push(windDirectionData[direction]);
                });
                this.windData = [windData];

                // Get weather description data.
                const descData = results.data.reduce((result, row) => {
                        result[row.Description] = result[row.Description] ? result[row.Description] + 1 : 1;
                        return result;
                    }, {});

                // Sort weather description by occurrence.
                const sortedDescData = Object.keys(descData)
                    .map((description) => ({
                        label: description,
                        value: descData[description],
                    }))
                    .sort((a, b) => a.value < b.value);

                // Prepare weather description data.
                this.descData = [ sortedDescData.map((row) => row.value) ];
                this.descLabels = sortedDescData.map((row) => row.label);
            },
        });
    },
};
</script>
