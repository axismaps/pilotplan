/**
 * Module initializes timeline component
 * @module initTimeline
 */

import Timeline from '../timeline/timeline';
import { yearRange } from '../config/config';

const initTimeline = function initTimeline() {
  const { state } = this.components;
  this.components.timeline = new Timeline({
    mobile: state.get('mobile'),
    language: state.get('language'),
    eras: this.data.eras,
    uniqueYears: this.data.years,
    year: state.get('year'),
    updateYear(newYear) {
      state.update({ year: Math.round(newYear) });
    },
    yearRange,
    stepSections: [
      {
        years: [yearRange[0], 1955],
        increment: 2,
      },
      {
        years: [1955, yearRange[1]],
        increment: 1,
      },
    ],
  });
};

export default initTimeline;
