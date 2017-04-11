export default {
  daysFromNow: days => {
    return new Date().getTime() + 1000 * 60 * 60 * 24 * days;
  },
};
