import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function pj(x) { return JSON.parse(JSON.stringify(x)); }

const problems = [
  {
    slug: 'two-sum', title: 'Two Sum', difficulty: 'Medium', tags: 'array,hash-map',
    statement: 'Given nums and target, return indices [i,j] such that nums[i]+nums[j]=target. Implement solve(nums, target).',
    starterJs: `function solve(nums, target){
  const m = new Map();
  for (let i=0;i<nums.length;i++){
    const need = target - nums[i];
    if (m.has(need)) return [m.get(need), i];
    m.set(nums[i], i);
  }
  return [];
}
module.exports = { solve };`,
    starterPy: `def solve(nums, target):
    m = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in m:
            return [m[need], i]
        m[x] = i
    return []
`,
    testsJson: pj([
      { input: [[2,7,11,15], 9], output: [0,1] },
      { input: [[3,2,4], 6], output: [1,2] },
    ])
  },
  {
    slug: 'reverse-string', title: 'Reverse String', difficulty: 'Easy', tags: 'string,two-pointers',
    statement: 'Given a string s, return the reversed string. Implement solve(s).',
    starterJs: `function solve(s){ return s.split('').reverse().join(''); }\nmodule.exports = { solve };`,
    starterPy: `def solve(s):\n    return s[::-1]\n`,
    testsJson: pj([{ input: ['ab'], output: 'ba' }, { input: [''], output: '' }])
  },
  {
    slug: 'fizz-buzz', title: 'Fizz Buzz', difficulty: 'Easy', tags: 'math',
    statement: 'Return list of strings for 1..n; multiples of 3 -> Fizz, 5 -> Buzz, both -> FizzBuzz. Implement solve(n).',
    starterJs: `function solve(n){ const out=[]; for(let i=1;i<=n;i++){ let s=''; if(i%3===0)s+='Fizz'; if(i%5===0)s+='Buzz'; out.push(s||String(i)); } return out;} module.exports={solve};`,
    starterPy: `def solve(n):\n    out=[]\n    for i in range(1,n+1):\n        s=''\n        if i%3==0: s+='Fizz'\n        if i%5==0: s+='Buzz'\n        out.append(s or str(i))\n    return out\n`,
    testsJson: pj([{ input: [3], output: ['1','2','Fizz'] }])
  },
];

// Add many more medium/hard problems with minimal tests.
const more = [
  ['3sum', '3Sum', 'Medium', 'array,two-pointers', 'Given nums, return all unique triplets that sum to 0. Implement solve(nums).'],
  ['group-anagrams', 'Group Anagrams', 'Medium', 'hash-map,string', 'Group anagrams together. Implement solve(strs).'],
  ['max-subarray', 'Maximum Subarray', 'Medium', 'array,dp', 'Find max subarray sum. Implement solve(nums).'],
  ['product-except-self', 'Product of Array Except Self', 'Medium', 'array,prefix', 'Return product of array except self. Implement solve(nums).'],
  ['merge-intervals', 'Merge Intervals', 'Medium', 'intervals,sorting', 'Merge overlapping intervals. Implement solve(intervals).'],
  ['meeting-rooms-ii', 'Meeting Rooms II', 'Medium', 'intervals,heap', 'Minimum meeting rooms required. Implement solve(intervals).'],
  ['coin-change', 'Coin Change', 'Medium', 'dp', 'Fewest coins to make amount. Implement solve(coins, amount).'],
  ['lis', 'Longest Increasing Subsequence', 'Medium', 'dp', 'Length of LIS. Implement solve(nums).'],
  ['edit-distance', 'Edit Distance', 'Hard', 'dp,string', 'Minimum edit distance. Implement solve(word1, word2).'],
  ['word-ladder', 'Word Ladder', 'Hard', 'bfs,graph', 'Shortest transformation sequence length. Implement solve(beginWord, endWord, wordList).'],
  ['course-schedule', 'Course Schedule', 'Medium', 'graph,topo', 'Detect if can finish courses. Implement solve(numCourses, prerequisites).'],
  ['number-of-islands', 'Number of Islands', 'Medium', 'dfs,bfs,grid', 'Count islands in grid of 0/1. Implement solve(grid).'],
  ['kth-largest', 'Kth Largest Element in an Array', 'Medium', 'heap,quickselect', 'Find kth largest. Implement solve(nums, k).'],
  ['median-two-sorted', 'Median of Two Sorted Arrays', 'Hard', 'binary-search', 'Median of two sorted arrays. Implement solve(nums1, nums2).'],
  ['sliding-window-maximum', 'Sliding Window Maximum', 'Hard', 'deque,sliding-window', 'Max of each window k. Implement solve(nums, k).'],
  ['min-window-substring', 'Minimum Window Substring', 'Hard', 'sliding-window', 'Minimum window containing t. Implement solve(s, t).'],
  ['serialize-bt', 'Serialize and Deserialize Binary Tree', 'Hard', 'tree,design', 'Serialize/deserialize tree. Implement solve(root) or equivalent signature.'],
  ['lru-cache', 'LRU Cache', 'Medium', 'design,hash-map', 'Design LRU cache. Implement class LRUCache with get/put.'],
  ['trie-word-search-ii', 'Word Search II', 'Hard', 'trie,dfs', 'Find words in grid. Implement solve(board, words).'],
  ['n-queens', 'N-Queens', 'Hard', 'backtracking', 'Return all distinct solutions. Implement solve(n).'],
  ['sudoku-solver', 'Sudoku Solver', 'Hard', 'backtracking', 'Solve Sudoku. Implement solve(board).'],
  ['regex-matching', 'Regular Expression Matching', 'Hard', 'dp', 'Implement regex matching . and *. Implement solve(s, p).'],
  ['wildcard-matching', 'Wildcard Matching', 'Hard', 'dp', 'Implement wildcard matching ? and *. Implement solve(s, p).'],
  ['jump-game', 'Jump Game', 'Medium', 'greedy', 'Can reach last index? Implement solve(nums).'],
  ['gas-station', 'Gas Station', 'Medium', 'greedy', 'Start index to complete circuit. Implement solve(gas, cost).'],
  ['largest-rectangle', 'Largest Rectangle in Histogram', 'Hard', 'stack', 'Largest rectangle area. Implement solve(heights).'],
  ['trapping-rain-water', 'Trapping Rain Water', 'Hard', 'two-pointers,stack', 'Amount of water trapped. Implement solve(height).'],
  ['rotate-array', 'Rotate Array', 'Medium', 'array', 'Rotate array by k. Implement solve(nums, k).'],
  ['binary-search', 'Binary Search', 'Medium', 'binary-search', 'Basic binary search. Implement solve(nums, target).'],
  ['top-k-frequent', 'Top K Frequent Elements', 'Medium', 'heap,hash-map', 'Return top k frequent. Implement solve(nums, k).'],
  ['kth-smallest-bst', 'Kth Smallest in BST', 'Medium', 'tree', 'Find kth smallest in BST. Implement solve(root, k).'],
  ['house-robber', 'House Robber', 'Medium', 'dp', 'Max sum without adjacent. Implement solve(nums).'],
  ['house-robber-ii', 'House Robber II', 'Medium', 'dp', 'Circular houses. Implement solve(nums).'],
  ['word-break', 'Word Break', 'Medium', 'dp', 'Can segment string. Implement solve(s, wordDict).'],
  ['subsets', 'Subsets', 'Medium', 'backtracking', 'All subsets. Implement solve(nums).'],
  ['permutations', 'Permutations', 'Medium', 'backtracking', 'All permutations. Implement solve(nums).'],
  ['combination-sum', 'Combination Sum', 'Medium', 'backtracking', 'All combinations sum to target. Implement solve(candidates, target).'],
  ['coin-change-ii', 'Coin Change II', 'Medium', 'dp', 'Number of combinations. Implement solve(amount, coins).'],
  ['int-to-english', 'Integer to English Words', 'Hard', 'math,string', 'Convert integer to words. Implement solve(num).'],
  ['alien-dictionary', 'Alien Dictionary', 'Hard', 'graph,topo', 'Find order of letters. Implement solve(words).'],
  ['lfu-cache', 'LFU Cache', 'Hard', 'design,hash-map', 'Design LFU cache. Implement class LFUCache.'],
  ['min-stack', 'Min Stack', 'Medium', 'stack,design', 'Design MinStack with getMin in O(1).'],
  ['median-data-stream', 'Find Median from Data Stream', 'Hard', 'heap,design', 'Data structure to find median.'],
  ['skyline-problem', 'The Skyline Problem', 'Hard', 'sweep-line', 'Compute skyline. Implement solve(buildings).'],
  ['shortest-path-dag', 'Shortest Path in DAG', 'Medium', 'graph,dp', 'Shortest path in DAG. Implement solve(n, edges, src).'],
  ['dijkstra', 'Dijkstra Shortest Path', 'Medium', 'graph', 'Compute shortest paths. Implement solve(n, edges, src).'],
  ['bellman-ford', 'Bellman-Ford', 'Medium', 'graph', 'Detect negative cycles and shortest paths.'],
  ['kruskal', 'Kruskal MST', 'Medium', 'graph,dsu', 'Minimum spanning tree using DSU.'],
  ['prim', 'Prim MST', 'Medium', 'graph,heap', 'Minimum spanning tree using Prim.'],
  ['longest-consecutive', 'Longest Consecutive Sequence', 'Medium', 'hash-set', 'Length of longest consecutive sequence. Implement solve(nums).'],
  ['word-search', 'Word Search', 'Medium', 'dfs,grid', 'Does word exist in grid? Implement solve(board, word).'],
];

// Create minimal generic starters and tests for the additional problems
for (const [slug, title, difficulty, tags, statement] of more) {
  problems.push({
    slug, title, difficulty, tags,
    statement,
    starterJs: `function solve(){ /* TODO */ }\nmodule.exports={solve};`,
    starterPy: `def solve(*args, **kwargs):\n    # TODO\n    return None\n`,
    testsJson: pj([{ input: [], output: null }])
  });
}

async function main() {
  for (const p of problems) {
    await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        difficulty: p.difficulty,
        tags: p.tags,
        statement: p.statement,
        starterJs: p.starterJs,
        starterPy: p.starterPy,
        testsJson: p.testsJson,
      },
      create: {
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        tags: p.tags,
        statement: p.statement,
        starterJs: p.starterJs,
        starterPy: p.starterPy,
        testsJson: p.testsJson,
      }
    });
  }
  console.log(`Seeded ${problems.length} problems`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
