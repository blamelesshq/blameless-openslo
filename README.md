# Blameless SLO YAML specs

The design of the Blameless SLO YAML specs has been inspired by the [OpenSLO specification](https://github.com/openslo/openslo) maintained by the emerging OpenSLO community.

For more information about OpenSLO and its latest specification:
* https://openslo.com/
* Official repo: https://github.com/openslo/openslo
* OpenSLO spec validator: https://github.com/openslo/oslo

For more information about **Blameless SLO Manager**
* https://docs.blameless.com/features/slo/slo-guide-intro

For more information about the Blameless SLO API Endpoints
  * [Blameless SLO API doc](https://blameless.blameless.io/api/v1/services/SLOService/)
  * [Blameless SLO Timeseries docs](https://blameless.blameless.io/api/v1/services/SLOTimeSeriesService/doc)

## The Blameless SLO data model

There are 8 resource types in 2 categories:
1. **Objectives**
* User Journey (groups of SLOs)
* SLO
* Service (group of SLIs)
* SLI

2. **Notification**
* Error Budget Policy
* Alert Policy (*)
* Alert Condition (*)
* Alert Notification (*)


Resources specific to the Blameless specification:
```
apiVersion: blameless/v1alpha
kind: SLI | Service | SLO | UserJourney | ErrorBudgetPolicy
```

(*) New resource types still under consideration for the OpenSLO specification (see [pull request #54](https://github.com/OpenSLO/OpenSLO/pull/54)):
```
apiVersion: openslo/v1alpha
kind: AlertPolict | Service | SLO | UserJourney
```

### SLIs

* SLIs are created first and independently from SLOs.

* Blameless supports four types of SLIs (`sliType` parameter):
  1. Availability
  2. Latency
  3. Throughput
  4. Saturation

* Availability SLIs are ratio types of metrics (`ratioMetric`), while the other SLI types are threshold based metrics (`ratioMetric`).

* SLIs are grouped in a Blameless resource called `Service`.

**Structure of a metric**
```
      source: string      # data source
      queryType: string   # a name for the type of query to run on the data source
      query: string       # the query to run to return a metric
      metadata:           # optional, allows data source specific details to be passed
```

**Possible values**
```
      source: prometheus | newrelic | datadog | pingdom
      queryType: query | metricname
      query: <actual query> | <name or path to the metric>
```
For `datadog` and `pingdom`, `metricname` must be selected, otherwise select `query`.

For Availability type SLIs, 2 metrics must be specified:
```
  ratioMetric:
    good: # the numerator
      source: string      # data source for the "good" numerator
      queryType: string   # a name for the type of query to run on the data source
      query: string       # the query to run to return the numerator
      metadata:           # optional, allows data source specific details to be passed
    total: # the denominator
      source: string      # data source for the "total" denominator
      queryType: string   # a name for the type of query to run on the data source
      query: string       # the query to run to return the denominator
      metadata:           # optional, allows data source specific details to be passed
```

For other SLI types, only 1 metric must be specified
```
  thresholdMetric:     # represents the metric used to inform the SLO in the objectives stanza
    source: string     # data source for the metric
    queryType: string  # a name for the type of query to run on the data source
    query: string      # the query to run to return the metric
    metadata:          # optional, allows data source specific details to be passed
```

### SLOs

* One or more SLOs can be created on the same SLI.

* SLOs are grrouped into a Blameless resource called "UserJourney"

#### SLO status
The SLO status is a required SLO setting which indicates if the attached Error Budget Policy (EPB) is active and if the SLO can be edited or not.

| SLO status  | EBP active | Editable |
| ----------- | ---------- | -------- |
| development | no         | yes      |
| testing     | yes        | yes      |
| active      | yes         | no      |




### Service

| Property    | Description |
| ----------- | ----------- |
| Name        | Required    |
| Description | Required    |
| Notes       | Optional    |


### User Journey

| Property    | Description |
| ----------- | ----------- |
| Name        | Required    |
| Description | Optional    |
| Owner       | Required    |

The `Owner` is currently a required parameter. Does the Blameless SLO API require an owner ID or a full name?


