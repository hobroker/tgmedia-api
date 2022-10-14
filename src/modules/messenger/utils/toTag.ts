import { compose, concat, replace } from 'ramda';

export const toTag = compose(concat('#'), replace(/\s/g, ''));
