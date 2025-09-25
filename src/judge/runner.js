import { execFile } from 'child_process';

function runNodeTest(code, args, timeLimitMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const script = `
      (async () => {
        try {
          const MOD = {};
          let module = { exports: MOD };
          let exports = MOD;
          ${code}\n
          const res = (typeof solve === 'function' ? solve : (module && module.exports && module.exports.solve));
          if (!res) {
            console.log(JSON.stringify({ __error: 'No solve() function exported' }));
            return;
          }
          const input = ${JSON.stringify(args)};
          const output = await res.apply(null, Array.isArray(input) ? input : [input]);
          console.log(JSON.stringify({ __result: output }));
        } catch (e) {
          console.log(JSON.stringify({ __error: String(e && e.stack || e) }));
        }
      })();
    `;

    const child = execFile('node', ['-e', script], { timeout: timeLimitMs }, (error, stdout, stderr) => {
      const timeMs = Date.now() - start;
      if (error && error.killed) {
        return resolve({ error: 'Time Limit Exceeded', timeMs });
      }
      let out;
      try {
        out = JSON.parse(stdout.trim());
      } catch (e) {
        return resolve({ error: stderr || stdout || 'Runtime Error', timeMs });
      }
      if (out.__error) return resolve({ error: out.__error, timeMs });
      return resolve({ result: out.__result, timeMs });
    });
  });
}

function runPythonTest(code, args, timeLimitMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const py = `
import json
import sys

${code}

def __main():
    try:
        args = json.loads('${JSON.stringify(args)}')
        if type(args) is list:
            res = solve(*args)
        else:
            res = solve(args)
        print(json.dumps({"__result": res}))
    except Exception as e:
        print(json.dumps({"__error": str(e)}))

__main()
`;
    const child = execFile('python', ['-c', py], { timeout: timeLimitMs }, (error, stdout, stderr) => {
      const timeMs = Date.now() - start;
      if (error && error.killed) {
        return resolve({ error: 'Time Limit Exceeded', timeMs });
      }
      let out;
      try {
        out = JSON.parse(stdout.trim());
      } catch (e) {
        return resolve({ error: stderr || stdout || 'Runtime Error', timeMs });
      }
      if (out.__error) return resolve({ error: out.__error, timeMs });
      return resolve({ result: out.__result, timeMs });
    });
  });
}

export async function runSubmission({ language, code, tests, timeLimitMs = 2000 }) {
  const results = [];
  let passed = 0;

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    let single;
    if (language === 'javascript') {
      single = await runNodeTest(code, t.input, timeLimitMs);
    } else if (language === 'python') {
      single = await runPythonTest(code, t.input, timeLimitMs);
    } else {
      single = { error: 'Unsupported language' };
    }
    const expect = t.output;
    const got = single.result;
    const pass = single.error ? false : JSON.stringify(got) === JSON.stringify(expect);
    if (pass) passed++;
    results.push({
      test: i + 1,
      input: t.input,
      expected: expect,
      got: single.error ? null : got,
      error: single.error || null,
      timeMs: single.timeMs || null,
      pass,
    });
  }

  return {
    total: tests.length,
    passed,
    results,
    status: passed === tests.length ? 'Accepted' : (passed > 0 ? 'Partial' : 'Wrong Answer')
  };
}
