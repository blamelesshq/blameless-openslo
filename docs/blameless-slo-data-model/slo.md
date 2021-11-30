# SLOs

-   One or more SLOs can be created on the same SLI.

-   SLOs are grrouped into a Blameless resource called "UserJourney"

## SLO status

The **SLO status** is a required SLO setting which indicates if the attached **Error Budget Policy (EPB)** is active and if the SLO can be edited or not.

| SLO status  | EBP active | Editable |
| ----------- | ---------- | -------- |
| development | no         | yes      |
| testing     | yes        | yes      |
| active      | yes        | no       |

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

The **`Owner`** is currently a required parameter. Blameless SLO API require an owner email address.

<div style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-between;">
<div>
    <a href="slis.md">< PREV: SLIs</a>
</div>
<div>
    <a href="../blameless-slo-cli/describe-blameless-cli.md">NEXT: WHAT IS BLAMELESS SLO CLI ></a>
</div>
</div>