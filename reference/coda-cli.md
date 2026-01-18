## Running code locally

Once published, your Pack functionality will be executed on Coda servers after being invoked from a Coda doc. During the development process, you can call your formulas directly from the command line, to simulate this process for rapid development. When you're nearing the end of authoring your Pack, you can upload your Pack to Coda and run it in a real doc to verify it works as intended.


### Running formulas

The `coda` CLI utility helps you execute formulas, via the `coda execute` sub-command. You can run `coda execute --help` at any time to refresh yourself on usage. The syntax is:

```sh
npx coda execute path/to/pack.ts <formula> [params..]
```

So for example, if your Pack definition was in `src/pack.ts` and you wanted to call a function named "Hello" that takes one argument, you'd run:

```sh
npx coda execute src/pack.ts Hello "World"
```

This will execute the formula and print the output to the terminal.


### Passing parameters

To pass parameters to a formula when using `coda execute`, include them as separate arguments after the formula name. Like with all Coda formulas, parameters are passed positionally.

```sh
npx coda execute src/pack.ts MyFormula "one" "two" "three"
```

!!! note "Wrap arguments in quotes"
    If your arguments have spaces or special characters in them, make sure to put them in quotation marks when specifying them on the command line.

The CLI will look at your Pack definition to determine the types of your parameters and will interpret your arguments accordingly. For example, if your formula takes a string and you pass `123` as an argument on the command line, it will know to interpret that as a string. But if your formula takes a number, it will interpret `123` as a number before executing the formula.

```sh
# String
npx coda execute src/pack.ts MyFormula "Hello"
# Number
npx coda execute src/pack.ts MyFormula "42"
# Boolean
npx coda execute src/pack.ts MyFormula "true"
# Date
npx coda execute src/pack.ts MyFormula "1955-11-12T22:04:00-08:00"
# Image
npx coda execute src/pack.ts MyFormula "https://codahosted.io/..."
# HTML
npx coda execute src/pack.ts MyFormula "Hello <b>World</b>"
```

To pass array parameters, use a single argument for the parameter separating the values by a comma. For example, the argument `[1, 2, 3]` should be passed as `"1,2,3"`.

```sh
# StringArray
npx coda execute src/pack.ts MyFormula "apple,banana,carrot"
# NumberArray
npx coda execute src/pack.ts MyFormula "1,1,2,3,5,8"
# BooleanArray
npx coda execute src/pack.ts MyFormula "true,false,true"
# DateArray
npx coda execute src/pack.ts MyFormula "1985-10-26,1955-11-12"
```

!!! warning "Can't escape commas"
    It currently isn't possible to escape commas in `StringArray` parameter values. To test your formula with arrays of strings containing commas you'll need to either [write a test case][testing] or [upload](#upload) it to Coda's servers and try it in a real doc.


### Running syncs

The above examples shows how to execute a regular Pack formula. Executing a sync is almost identical:

```sh
npx coda execute path/to/pack.ts <sync name> [params..]
```

So for example, if you had a sync called "Items", that took a start date as a parameter, you would execute this as:

```sh
npx coda execute src/pack.ts Items "2020-12-15"
```

This will execute your sync formula repeatedly until there are no more results, and print the output array of all result objects to the terminal. See the [Sync tables guide][sync_tables] for more information about how and why sync formulas are invoked repeatedly for paginated results.

To run a sync for a dynamic sync table, use the `--dynamicUrl` parameter to specify which URL to sync from.

```sh
npx coda execute src/pack.ts Items --dynamicUrl=https://example.com/api/table
```


#### Two-way sync

For sync tables that support two-way sync, you can run the `executeUpdate` function by appending `:update` to the name of the sync table.

```sh
npx coda execute path/to/pack.ts <sync name>:update [params..] [updates json]
```

In addition to passing parameter values you must also include the value of the `updates` array as a JSON string.

```sh
npx coda execute src/pack.ts Items:update "2020-12-15" \
  '[{"previousValue":{}, "newValue": {}, "updatedFields": []}]'
```

Writing JSON on the command line can be a bit tricky however, so we recommend you author it in a file instead. The example below loads the value from `updates.json`, making sure to remove line breaks.

```sh
npx coda execute src/pack.ts Items:update "2020-12-15" \
  "$(cat updates.json | tr '\n' ' ')"
```


### Running metadata functions

More complicated Packs may have a lot of code outside of the core `execute` function, used to generate metadata like parameter autocomplete values. You can run those functions using the CLI as well, using the same `execute` command and including additional information after the name of the formula or sync table.

For example, to execute the autocomplete function for the parameter "language" in the formula "Hello" you could run the following:

```sh
npx coda execute src/pack.ts Hello:autocomplete:language
```

You can pass a value for the search string as the first argument after the formula name.

```sh
npx coda execute src/pack.ts Hello:autocomplete:language "Eng"
```

In some cases the autocomplete function depends on the value of previous parameters. You can pass those parameter values as a JSON string in the second argument after the formula name. In this example, the parameter "greeting" depends on the value of the "language" parameter.

```sh
npx coda execute src/pack.ts Hello:autocomplete:greeting "" '{"language": "en"}'
```

A similar pattern is used to call a variety of metadata functions, as shown in the list below.

```sh
# Parameter autocomplete
npx coda execute path/to/pack.ts <formula name>:autocomplete:<paramName> [query] [params JSON]
npx coda execute path/to/pack.ts <sync name>:autocomplete:<paramName> [query] [params JSON]

# Dynamic sync tables
npx coda execute path/to/pack.ts <sync name>:listDynamicUrls [parentUrl]
npx coda execute path/to/pack.ts <sync name>:searchDynamicUrls [query]
npx coda execute path/to/pack.ts <sync name>:getName
npx coda execute path/to/pack.ts <sync name>:getDisplayUrl
npx coda execute path/to/pack.ts <sync name>:getSchema [unused] [params JSON]

# Authentication
npx coda execute path/to/pack.ts Auth:getConnectionName
npx coda execute path/to/pack.ts Auth:postSetup:setEndpoint:<stepName>
```


## Authentication {: #authentication}

The SDK will help you set up authentication in your development environment so that you can execute Pack formulas with authentication applied to them. This allows you to run your code end-to-end including making fetcher requests to external APIs.

The `coda auth` utility is used to set up authentication for a Pack. Run `coda auth --help` at any time for a refresher on how to use the utility. Mostly, it's as simple as running

```sh
npx coda auth path/to/pack.ts
```

The utility will inspect your Pack definition to see what kind of authentication you have defined, and then it will prompt you to provide in the console the necessary token(s) or other parameters required by your authorization type. The resulting credentials you provide will be stored in a file `.coda-credentials.json` in the same directory as your Pack definition.

!!! info "Local OAuth2 flow"
    If you are using `OAuth2` authentication, after you provide the client ID and secret it will launch an OAuth flow in your browser. This flow runs a temporary, local server at `http://localhost:3000/oauth` to handle the redirect. You will need to ensure that your client ID is configured to allow this redirect URL.

The credentials will be automatically applied to your fetch requests when you execute a Pack from the CLI or a test. For more information on using the fetcher in tests, see the [Integration tests][integration] section.