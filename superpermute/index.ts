import { from_multiplicities } from "../src";

function overlap(a: string, b: string) {
  const al = a.length;
  const bl = b.length;
  const l = Math.min(al, bl);

  let max = 0;
 
  // test suffixes of a against prefixes of b
  outer: for (let i = 1; i < l; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (a[al - i + j] !== b[j]) continue outer;
    }
    max = Math.max(max, i);
  }

  return max;
}

function extend(current: string, p: string) {
  // find maximum overlap 
  const pre = overlap(p, current);
  const suf = overlap(current, p);
  if (pre > suf) {
    return p + current.slice(pre);
  }

  // if both are zero, we default to suffixing
  return current + p.slice(suf);
}

function rewrite(digits: string, n: number) {
  let i = 0;
  const order = new Map<string, number>();
  for (const d of digits) {
    if (order.has(d)) continue;
    order.set(d, ++i);
    if (i === n) break;
  }
  return digits.split('').map(d => order.get(d)).join('');
}

function permute_rec(
  current: string,
  ps: string[],  
  support: number,
  candidates: Set<string>,
  minl: number,
  seen: Set<string>,
): number {
  const pl = ps.length;
  if (pl === 0) {
    const cl = current.length;
    if (cl < minl) {
      candidates.clear();
      minl = cl;
      console.log("Current minimum: ", minl);
    }

    const candidate = rewrite(current, support);
    const rev = candidate.split('').reverse().join(''); 
    if (!candidates.has(rev) && !candidates.has(candidate)) {
      candidates.add(candidate);
      console.log(candidate);
    }
    return minl;
  }

  const used = new Set<number>();
  for (let i = 0; i < pl; i++) {
    if (current.includes(ps[i])) used.add(i);
  }

  for (let i = 0; i < pl; i++) {
    if (used.has(i)) continue;
    const next = extend(current, ps[i]);
    if (seen.has(next)) continue;
    if (next.length > minl) return minl;
    const nps = ps.filter((_, j) => j !== i && !used.has(j));
    minl = permute_rec(next, nps, support, candidates, minl, seen);
    seen.add(next);
  }

  return minl;
}

function supermulti(...multiplicities: number[]) {
  const perms = [...from_multiplicities(multiplicities)]
    .map(a => a.join(''));

  console.log("Multiplicities: ", JSON.stringify(multiplicities));
  console.log("Permutations: ", perms.length);
  console.log("Multiset:", perms[0]);
  
  const candidates = new Set<string>();
  const l = permute_rec(
    perms[0], perms.slice(1),
    multiplicities.length,
    candidates, Infinity,
    new Set(),
  );

  console.log("Optimal length:", l);
  for (const p of candidates) console.log(p);
}

supermulti(1,1,2);
