import d3 from '@/assets/d3';
import parse from 'date-fns/parse';

const TIME_SERIES_CONFIRMED = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
const TIME_SERIES_DEATHS = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv';
const TIME_SERIES_RECOVERED = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv';

const processData = (url) => d3.csv(url, (row) => ({
  'Province/State': row['Province/State'],
  'Country/Region': row['Country/Region'],
  latLng: [+row.Lat, +row.Long],
  series: Object.keys(row)
    .filter((k) => !([
      'Province/State',
      'Country/Region',
      'Lat',
      'Long',
    ].includes(k)))
    .map((k) => ({ key: parse(k, 'M/d/yy', new Date()), value: +row[k] })),
}));

export default {
  TIME_SERIES_CONFIRMED,
  TIME_SERIES_DEATHS,
  TIME_SERIES_RECOVERED,
  getTimeSeriesConfirmed() {
    return processData(TIME_SERIES_CONFIRMED);
  },
  getTimeSeriesDeaths() {
    return processData(TIME_SERIES_DEATHS);
  },
  getTimeSeriesRecovered() {
    return processData(TIME_SERIES_RECOVERED);
  },
};
