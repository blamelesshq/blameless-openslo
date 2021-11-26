---
sidebar_position: 2
---

# SLIs

-   **SLIs** are created first and independently from **SLOs**.

-   Blameless supports four types of **SLIs** ( `sliType` parameter):

    1. **Availability**
    2. **Latency**
    3. **Throughput**
    4. **Saturation**

-   Availability SLIs are ratio types of metrics ( `ratioMetric` ), while the other SLI types are threshold based metrics ( `ratioMetric` ).

-   SLIs are grouped in a Blameless resource called **`Service`**.

**Structure of a metric**

```yaml
source: string # data source
queryType: string # a name for the type of query to run on the data source
query: string # the query to run to return a metric
metadata: # optional, allows data source specific details to be passed
```

**Possible values**

```yaml
source: prometheus | newrelic | datadog | pingdom
queryType: query | metricname
query: <actual query> | <name or path to the metric>
```

For `datadog` and `pingdom`, `metricname` must be selected, otherwise select `query`.

For Availability type SLIs, 2 metrics must be specified:

```yaml
ratioMetric:
    good: # the numerator
        source: string # data source for the "good" numerator
        queryType: string # a name for the type of query to run on the data source
        query: string # the query to run to return the numerator
        metadata: # optional, allows data source specific details to be passed
    total: # the denominator
        source: string # data source for the "total" denominator
        queryType: string # a name for the type of query to run on the data source
        query: string # the query to run to return the denominator
        metadata: # optional, allows data source specific details to be passed
```

For other SLI types, only 1 metric must be specified

```yaml
thresholdMetric: # represents the metric used to inform the SLO in the objectives stanza
    source: string # data source for the metric
    queryType: string # a name for the type of query to run on the data source
    query: string # the query to run to return the metric
    metadata: # optional, allows data source specific details to be passed
```
