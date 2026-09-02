const escapeStr = `\`\\/"'`;

const arr = Object.freeze([4, '2']);

const obj = Object.freeze({
  str: 'hello',
  num: 42,
  bool: true,
  undef: undefined,
});

const nested = Object.freeze({
  arr: Object.freeze([4, undefined, '2']),
  obj: Object.freeze({
    str: 'world',
    num: 100,
    bool: false,
  }),
});
