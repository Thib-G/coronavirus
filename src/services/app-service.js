import d3 from '@/assets/d3';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';

const TIME_SERIES_CONFIRMED = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const TIME_SERIES_DEATHS = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const TIME_SERIES_RECOVERED = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv';

const COMMUNES = 'https://raw.githubusercontent.com/Thib-G/coronavirus/master/data/communes_ign_20m.geojson';
const COVID19BE_CASES_MUNI_CUM = 'https://raw.githubusercontent.com/Thib-G/coronavirus/master/data/COVID19BE_CASES_MUNI_CUM.utf8.json';
const COVID19BE_CASES_MUNI_CUM_LAST_UPDATE = 'https://raw.githubusercontent.com/Thib-G/coronavirus/master/data/COVID19BE_CASES_MUNI_CUM.utf8.last_update.txt';
const POPULATION_2019 = 'https://raw.githubusercontent.com/Thib-G/coronavirus/master/data/population2019.csv';

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
    return Promise.all([
      d3.json(COMMUNES),
      d3.json(COVID19BE_CASES_MUNI_CUM),
      d3.csv(POPULATION_2019, (row) => Object.assign(
        row,
        {
          POP: parseInt(row.POP, 10),
          AREA: parseFloat(row.AREA),
        },
      )),
    ])
      .then(([geojson, casesData, population]) => Object.assign(
        geojson,
        {
          features: geojson.features.map((feature) => Object.assign(
            feature,
            {
              properties: Object.assign(
                feature.properties,
                {
                  cases: casesData
                    .find((c) => c.NIS5 === feature.properties.NISCode),
                  population: population
                    .find((p) => p.CD_REFNIS === feature.properties.NISCode),
                },
              ),
            },
          )),
        },
      ));
  },
  getBelgiumCommunesLastUpdate() {
    return d3.text(COVID19BE_CASES_MUNI_CUM_LAST_UPDATE).then((txt) => {
      const dateStr = txt.replace('    autoupdate at ', '').replace(/^\s+|\s+$/g, '');
      return parseISO(dateStr);
    });
  },
};
