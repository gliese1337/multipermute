var multipermute = require('./multipermute');

function overlap(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = Math.min(al, bl);

  let max = 0;

  // test suffixes of a against prefixes of b
  outer: for (let i = 1; i < l; i++) {
    const aprime = a.slice(al - i);
    const bprime = b.slice(0, i);
    for (let j = aprime.length - 1; j >= 0; j--) {
      if (aprime[j] !== bprime[j]) continue outer;
    }
    max = Math.max(max, i);
  }

  return max;
}

function supermulti(...multiplicities) {
  const ps = [...multipermute(multiplicities)];
  let current = ps.pop();
  const pl = current.length;
  main: while (ps.length) {
    const p = ps.pop();

    // check if p is contained in current
    const diff = current.length - pl;
    outer: for (let i = 0; i <= diff; i++) {
      for (let j = 0, k = i; j < pl; j++,k++) {
        if (p[j] !== current[k]) continue outer;
      }
      // console.log(`Found ${ JSON.stringify(p) } in ${ JSON.stringify(current) } at offset ${ i }`);
      continue main;
    }

    // find maximum overlap 
    const pre = overlap(p, current);
    const suf = overlap(current, p);
    if (pre > suf) {
      current = [...p, ...current.slice(pre)];
    } else {
      // if both are zero, we default to suffixing
      current = [...current, ...p.slice(suf)];
    }
    // console.log(`Put ${ JSON.stringify(p) } in ${ JSON.stringify(current) }`);
  }
  console.log(JSON.stringify(multiplicities), JSON.stringify(current.map(i => i + 1)));
}

supermulti(1,2);
supermulti(2,2);
supermulti(1,1,1);
supermulti(1,1,2);
supermulti(1,2,2);
supermulti(2,2,2);