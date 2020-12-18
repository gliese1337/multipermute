/*
This module encodes functions to generate the permutations of a multiset
following this algorithm:

Algorithm 1 
Visits the permutations of multiset E. The permutations are stored
in a singly-linked list pointed to by head pointer h. Each node in the linked
list has a value field v and a next field n. The init(E) call creates a
singly-linked list storing the elements of E in non-increasing order with h, i,
and j pointing to its first, second-last, and last nodes, respectively. The
null pointer is given by φ. Note: If E is empty, then init(E) should exit.
Also, if E contains only one element, then init(E) does not need to provide a
value for i.

[h, i, j] ← init(E) 
visit(h) 
while j.n ≠ φ orj.v <h.v do
    if j.n ≠    φ and i.v ≥ j.n.v then 
        s←j
    else
        s←i 
    end if
    t←s.n 
    s.n ← t.n 
    t.n ← h 
    if t.v < h.v then
        i←t 
    end if
    j←i.n 
    h←t 
    visit(h)
end while
*/

function visit(h) {
  const l = [];
  for (let o = h; o !== null; o = o.n) {
    l.push(o.v);
  }
  return l;
}

// Takes a list of multiplicities
function * multipermute(multiset) {
  const n = multiset.length;
  const p = [];
  for (let k = 0; k < n; k++) {
    for (let m = multiset[k]; m > 0; m--) {
      p.push(k);
    }
  }
  const l = p.length;
  let h = null, i = null, j = null;
  if (l > 0) h = i = j = { v: p[0], n: null };
  if (l > 1) h = i = { v: p[1], n: h };
  for (let k = 2; k < l; ++k) {
    h = { v: p[k], n: h };
  }

  yield visit(h);
  while (j.n || j.v < h.v) {
    const s = (j.n && i.v >= j.n.v) ? j : i;
    const t = s.n;
    s.n = t.n;
    t.n = h;
    if (t.v < h.v) {
      i = t;
    }
    j = i.n;
    h = t;
    yield visit(h);
  }
}

module.exports = multipermute;
