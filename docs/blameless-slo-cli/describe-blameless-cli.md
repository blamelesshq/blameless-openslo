---
sidebar_position: 1
---

# What is Blameless SLO CLI?

Blameless SLO CLI is npm package which is published at `blamelesshq` Github Repository as private npm package. ( `GPR` ). Blameless SLO CLI is used for validating `.yaml` files and processing them in order to create [resources in Blameless](../blameless-slo-data-model/resource-types).

Blameless SLO package integrates two packages: **`blameless-slo-validator`** and **`blameless-slo-deploy`**.

**`blameless-slo-validator`** - is used for validating `.yaml` specifications. You can specify path to file, or path to folder that contains `.yaml` files.

**`blameless-slo-deploy`** - is used for processing validated `.yaml` specs and creating resources in Blameless. Again here when the process of deploying is triggered we are invoking validator to validate files before actual deploy begins.
