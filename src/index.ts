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

A linked list must be used instead of an array because, as long as we keep a
reference to the nodes at the removal and insertion points, arbitrary shifts
(rotations of sub-lists) can be performed in constant time; this is what h, i,
and j are for.

[h, i, j] ← init(E) 
visit(h) 
while j.n ≠ φ or j.v < h.v do
    if j.n ≠ φ and i.v ≥ j.n.v then 
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

type ListNode = { n: ListNode | null; v: number };

function visit<T>(h: ListNode, remap: T[], l: number) {
  const p: T[] = [];
  for (let i = l - 1; i >= 0; i--) {
    p[i] = remap[h.v];
    h = h.n as ListNode;
  }
  return p;
}

// p must be sorted in ascending order
function * mp_gen<T>(p: number[], remap: T[]) {
  const l = p.length;

  // If the input is empty, exit.
  // There is only one permutation of the empty set.
  if (l === 0) {
    yield [];
    return;
  }

  // Init
  let h: ListNode = { v: p[0], n: null };
  let i: ListNode = h; // penultimate node
  let j: ListNode = h; // final node
  if (l > 1) h = i = { v: p[1], n: h };
  for (let k = 2; k < l; ++k) {
    h = { v: p[k], n: h };
  }

  // Visit permutations of the list
  yield visit(h, remap, l);
  let s: ListNode;
  for (;;) {
    if (j.n) s = i.v >= j.n.v ? j : i;
    else if (j.v >= h.v) break;
    else s = i;

    const t = s.n as ListNode;
    s.n = t.n;
    t.n = h;
    if (t.v < h.v) {
      i = t;
    }
    j = i.n as ListNode;
    h = t;
    yield visit(h, remap, l);
  }
}

function multiplicity2sorted(mults: number[]) {
  const n = mults.length;
  const permutation: number[] = [];
  for (let k = 0; k < n; k++) {
    for (let m = mults[k]; m > 0; m--) {
      permutation.push(k);
    }
  }

  return permutation;
}

export function from_multiplicities(mults: number[]) {
  const permutation = multiplicity2sorted(mults);
  const remap = Array.from(mults, (_, k) => k + 1);
  return mp_gen(permutation, remap);
}

export function count_multiplicities(multiplicities: Iterable<number>): number {
  let x = 1;
  let r = 1;
  for (let n of multiplicities) {
    if (n === 0) continue;
    for (let i = 0; i < n; i++) r *= x++;
    let f = n;
    while (--n > 1) f *= n;
    r /= f;
  }
  return r;
}

export function * swaps(n: number) {
  const c = Array.from({ length: n }, () => 0);
  let i = 0;
  while (i < n) {
    if (c[i] < i) {
      yield (i&1) ? [c[i], i] : [0, i];
      c[i] += 1;
      i = 0;
    } else {
      c[i] = 0;
      i++;
    }
  }
}