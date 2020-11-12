'use strict';

function add(a, b) {
  if (!b) return ((a, b) => +b + +a).bind(null, a);
  return +a + +b;
}

function sub(a, b) {
  if (!b) return ((a, b) => +b - +a).bind(null, a);
  return +a - +b;
}

function mul(a, b) {
  if (!b) return ((a, b) => +b * +a).bind(null, a);
  return +a * +b;
}

function div(a, b) {
  if (!b) return ((a, b) => +b / +a).bind(null, a);
  return +a / +b;
}

function pipe(...args) {
  return number => {
    for (const func of args) {
      number = func(number);
    }
    return number;
  }
}

console.log(add(10, 5));
console.log(sub(10, 5));
console.log(mul(10, 5));
console.log(div(10, 5));

const sub1 = sub(1);
console.log(sub1(30));
console.log(mul(sub(3, 1))(29));
console.log(pipe(add(58), sub(29), mul(30), div(3))(0));
console.log(pipe(add(1), mul(2))(3))

