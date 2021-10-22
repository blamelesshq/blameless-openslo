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
```yaml
apiVersion: blameless/v1alpha
kind: SLI | Service | SLO | UserJourney | ErrorBudgetPolicy
```

(*) New resource types still under consideration for the OpenSLO specification (see [pull request #54](https://github.com/OpenSLO/OpenSLO/pull/54)):
```yaml
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
```yaml
      source: string      # data source
      queryType: string   # a name for the type of query to run on the data source
      query: string       # the query to run to return a metric
      metadata:           # optional, allows data source specific details to be passed
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
```yaml
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

### Blameless SLO Package

Under `blamelesshq` organization there are currently two private npm packages.

* `blameless-slo-validator` - can be used standalone to validate yaml specifications, or used as an npm package.

* `blameless-slo-deploy` - is used for deploy yaml files in blameless instance. In the background in this package is used `blameless-slo-validator` in order to validate yaml files before procceed with deploy resources.

* blameless-slo package currently supports two `commands`:
  1. validate
  2. deploy

## How to find Blameless SLO Packages?

Blameless SLO Packages are private packages and they are deployed at `GPR` (Github Package Repository)

* Go to Github Blameless `https://github.com/orgs/blamelesshq` and navigate to `Packages` tab.

![Blameless Org Packages](https://i.postimg.cc/QdL7VPVx/packages-org-tab.png)

* Go to `https://github.com/blamelesshq/blameless-openslo` and on the right side you will be able to find packages

![Blameless Org Packages](https://i.postimg.cc/8zp7FrLs/packages-org-tab-2.png)


## How to use it?

First you have to install `blameless-slo-validator` globally like following example `npm install @blamelesshq/blameless-slo-validator@1.0.12 -g`
Please always use latest version of packages, because it includes more bug fixes and other improvements/features.

When you try to install first time it will throw error (404 Package Not Found)

In order to be able to install you need to set your `PAT` (Personal Access Token).

Navigate to `https://github.com/settings/tokens` and click on `Personal Access Token` at left side

Then click on `Generate New Token` and fill information like at the image bellow

![Token Generation](https://i.postimg.cc/m2DDBG4F/token-set.png)

At the end click `Generate Token` button.

Once you have installed `blameless-slo-validator` package, open Git Bash and type `blameless-slo`

![Token Generation](https://i.postimg.cc/c4mb7VtT/blameless-slo-inst.png)

First you have to set config.

* Acceptable config values:
  1. BLAMELESS_TENANT_BASE_URL: `https://your_instance_name.blameless.io/api/v1/`
  2. BLAMELESS_TEMP_AUTH_TOKEN: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` without `Bearer`
  3. REPOSITORY_PAT: `Use Personal Acccess Token that you have created before`
  4. REPOSITORY_OWNER: `Find your repository owner. In our case it's blamelesshq`
  5. REPOSITORY_NAME: `Find your repository name. In our case it's blameless-openslo`


Once you have set this config you should run again the same command `blameless-slo`
Depending of what you want to do possible options are: `blameless-slo validate` and `blameless-slo deploy`
