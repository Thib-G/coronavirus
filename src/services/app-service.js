import d3 from '@/assets/d3';
import parse from 'date-fns/parse';

const TIME_SERIES_CONFIRMED = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

export default {
  getTimeSeriesConfirmed() {
    return d3.csv(TIME_SERIES_CONFIRMED, (row) => ({
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
  },
};
