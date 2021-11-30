# Resource types in Blameless

There are 8 resource types in 2 categories:

1. **Objectives**

-   User Journey (groups of SLOs)
-   SLO
-   Service (group of SLIs)
-   SLI

## Resources specific to the Blameless specification

```yaml
apiVersion: blameless/v1alpha
kind: SLI | Service | SLO | UserJourney | ErrorBudgetPolicy
```

(\*) New resource types still under consideration for the OpenSLO specification (see [pull request #54](https://github.com/OpenSLO/OpenSLO/pull/54)):

```yaml
apiVersion: openslo/v1alpha
kind: AlertPolict | Service | SLO | UserJourney
```

<div style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-between;">
<div>
    <a href="../intro.md">< PREV: INTRO</a>
</div>
<div>
    <a href="slis.md">NEXT: SLIs ></a>
</div>
</div>
