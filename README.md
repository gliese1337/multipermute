# multipermute

Experiments in multiset superpermutation.

## Overview

`multipermute.js` contains code to generate all permutations of a multiset, forked from Erik Garrison's implementation of Aaron Williams's algorithm described in "Loopless Generation of Multiset Permutations using a Constant Number of Variables by Prefix Shifts."

`index.js` contains code to combine permutations into a superpermutation with a simple greedy algorithm.

`npm test` verifies the correctness of the permutation generator.

`npm run` executes index.js and outputs superpermutations for a few sample multisets.