import { csv, json } from 'd3-fetch';
import {
  select, selectAll, mouse, event,
} from 'd3-selection';
import { line } from 'd3-shape';
import { scaleLinear, scaleLog, scaleSequential } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';
import { interpolateGreens } from 'd3-scale-chromatic';

export default {
  csv,
  json,
  select,
  selectAll,
  line,
  scaleLinear,
  scaleLog,
  scaleSequential,
  mouse,
  event,
  axisBottom,
  axisLeft,
  transition,
  interpolateGreens,
};
