import d3 from '@/assets/d3';
import parse from 'date-fns/parse';

const TIME_SERIES_CONFIRMED = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const TIME_SERIES_DEATHS = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const TIME_SERIES_RECOVERED = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

const COMMUNES = 'https://raw.githubusercontent.com/Thib-G/coronavirus/master/data/communes.geojson';
const COVID19BE_CASES_MUNI_CUM = 'https://raw.githubusercontent.com/Thib-G/coronavirus/master/data/COVID19BE_CASES_MUNI_CUM.utf8.json';

const processData = (url) => d3.csv(url, (row, i) => ({
  id: i,
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
  getBelgiumCommunes() {
    return Promise.all([d3.json(COMMUNES), d3.json(COVID19BE_CASES_MUNI_CUM)])
      .then(([geojson, casesData]) => Object.assign(
        geojson,
        {
          features: geojson.features.map((feature) => Object.assign(
            feature,
            {
              properties: Object.assign(
                feature.properties,
                {
                  cases: casesData.find((c) => parseInt(c.NIS5, 10) === feature.properties.NSI),
                },
              ),
            },
          )),
        },
      ));
  },
};
