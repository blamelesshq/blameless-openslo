---
sidebar_position: 4
---

# How to use it?

Once you have successfully installed package, open your terminal and type following command **`blameless-slo`**.

<p align="center">
    <img src="/img/package_img/blameless-slo_config.PNG" />
</p>

If you see this message like above, that means that your package has been succesfully installed but config is missing. You need to set the proper values before you start using it.

**`BLAMELESS_TENANT_DOMAIN`** - You need to specify your blameless base URL. (ex. https://example.blameless.io)

**`BLAMELESS_TEMP_AUTH_TOKEN`** - Because of known login issue, you have to login via web UI and copy **`access_token`** and paste it.

**`REPOSITORY_PAT`** - Github PAT that you have already created.

**`REPOSITORY_OWNER`** - Github repository owner (in our case it is `blamelesshq`)

**`REPOSITORY_NAME`** - Github repository name (in our case it is `blameless-openslo`)

Once you successfully set config, re-type again the same command **`blameless-slo`**.

<p align="center">
    <img src="/img/package_img/blameless_slo_set_config.PNG" />
</p>

Now you can see that you have some available commands for executing **`blameless-slo validate`** and **`blameless-slo deploy`**

### How to use validate command?

Validate command is used for validation `.yaml` specs before they are executed and records beeing created. To be able to use it you have to type:

```jsx
 blameless-slo validate -s <source> -f <path_to_yaml>
```

**`<source>`** - Currently we support two types of source: **`local`** and **`github`**. So you have to choose between one of allowed options.

**`<path_to_yaml>`** - Path to your file, or folder that contains .yaml files.


> **_NOTE:_**  Validate command only validates .YAML specs. This command won't trigger deploy process. If you want to deploy resource you have to use deploy command.


### Validation message types?

There are tree types of validations message types: **`[BLAMELESS] WARNING`**, **`[BLAMELESS] SUCCESS`**, **`[BLAMELESS] ERROR`**.

**Examples:**

```bat
blameless-slo validate -s locals -f ./specs/
```

:warning: **[BLAMELESS] WARNING : Please specify type: Allowed options are: github | local**. In this case we are displaying this kind of warning because there is typo at source.

```bat
blameless-slo validate -s local -f ./specs/user_journey.yaml
```

:heavy_check_mark: **[BLAMELESS] SUCCESS : ========== Blameless UserJourney Validated Successfully ==========**. In this case we are displaying this kind od message because validation step for that spec was successfull.

```bat
blameless-slo validate -s local -f ./specs/sli.yaml
```

:x: **[BLAMELESS] ERROR : ========== Blameless SLI Validation Errors  ==========**. In this case we are displaying this kind od message because validation step for that spec was failed. Besides that we are displaying also information what is wrong.

**[BLAMELESS] ERROR : ========== Blameless SLI Validation Errors  ========== **<br />
[BLAMELESS] ERROR : 1: "spec.metricSource.mode" must be one of [direct, gcp, lambda] <br />
[BLAMELESS] ERROR : 2: "spec.metricSource.sourceName" is required <br />
[BLAMELESS] ERROR : 3: "spec.metricSource.name" is not allowed <br />


### How to use deploy command?

Deploy command is used for creating/updating resources in your Blameless instance. When you execute that command first it will validate specified yaml files, and if everything is okay, than it will proceed further by deploying resources. Similar like for validate command, for **deploy command** you should execute following code:

```jsx
 blameless-slo deploy -s <source> -f <path_to_yaml>
```

**`<source>`** - Currently we support two types of source: **`local`** and **`github`**. So you have to choose between one of allowed options.

**`<path_to_yaml>`** - Path to your file, or folder that contains .yaml files.
