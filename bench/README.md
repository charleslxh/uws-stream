# Benchmarking

`wrk -t2 -c2 -d30s http://localhost:7000`

Result:

- `express`

    ```bash
    Running 30s test @ http://localhost:7000
      2 threads and 2 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency   406.92us    1.32ms  29.36ms   97.47%
        Req/Sec     4.24k     1.04k    6.71k    75.33%
      253101 requests in 30.03s, 29.93MB read
    Requests/sec:   8429.53
    Transfer/sec:      1.00MB
    ```

- `koa`

    ```bash
    Running 30s test @ http://localhost:7000
      2 threads and 2 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency   289.91us  803.24us  29.08ms   99.02%
        Req/Sec     4.22k   754.73     5.77k    86.71%
      253031 requests in 30.10s, 34.27MB read
    Requests/sec:   8405.45
    Transfer/sec:      1.14MB
    ```

- `fastify`

    ```bash
    Running 30s test @ http://localhost:7000
      2 threads and 2 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency   363.45us    1.16ms  34.51ms   98.93%
        Req/Sec     3.64k   668.61     5.20k    75.50%
      217505 requests in 30.01s, 41.28MB read
      Non-2xx or 3xx responses: 217505
    Requests/sec:   7246.75
    Transfer/sec:      1.38MB
    ```

- `polka`

    ```bash
    Running 30s test @ http://localhost:7000
      2 threads and 2 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency   304.06us    1.33ms  39.63ms   98.63%
        Req/Sec     5.34k     0.95k    7.28k    79.67%
      319208 requests in 30.02s, 30.75MB read
    Requests/sec:  10631.50
    Transfer/sec:      1.02MB
    ```

- `native http module`

    ```bash
    Running 30s test @ http://localhost:7000
      2 threads and 2 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency   355.83us    1.77ms  57.10ms   98.47%
        Req/Sec     5.11k     0.95k    7.42k    81.00%
      305421 requests in 30.04s, 29.42MB read
    Requests/sec:  10168.81
    Transfer/sec:      0.98MB
    ```

- `uws http module`

    ```bash
    Running 30s test @ http://localhost:7000
      2 threads and 2 connections
      Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency   110.43us  278.87us  17.11ms   99.09%
        Req/Sec     9.67k     1.20k   12.17k    71.00%
      577284 requests in 30.02s, 22.02MB read
    Requests/sec:  19231.12
    Transfer/sec:    751.22KB
    ```
