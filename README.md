# @woifes/gjson

## Why?
This package implements the [GSJON](https://github.com/tidwall/gjson) json document search. The focus lies on the search aspect of GJSON because even though NodeJS comes with a good build-in JSON support. It misses a commong searching syntax.

**Please check the source code before using this package**

## Installation

```shell
npm install @woifes/gjson
```

## Quick start

```typescript
import { get } from "@woifes/gjson";

const exampleJson = {
    name: { first: "Tom", last: "Anderson" },
    age: 37,
    children: ["Sara", "Alex", "Jack"],
    "fav.movie": "Deer Hunter",
    friends: [
        { first: "Dale", last: "Murphy", age: 44, nets: ["ig", "fb", "tw"] },
        { first: "Roger", last: "Craig", age: 68, nets: ["fb", "tw"] },
        { first: "Jane", last: "Murphy", age: 47, nets: ["ig", "tw"] },
    ],
};

console.log( get(exampleJson, "name.first") ); //"Tom"
```

## Supported GJSON features

|GSJON feature|Supported?|Notes|
|---|---|---|
|[Path Structure](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#path-structure)|YES||
|[Basic](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#basic)|YES||
|[Wildcards](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#wildcards)|YES||
|[Escape Character](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#escape-character)|YES||
|[Arrays](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#arrays)|YES||
|[Queries](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#queries)|YES||
|[Dot vs Pipe](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#dot-vs-pipe)|YES||
|[Modifiers](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#modifiers)|NO||
|[Modifier arguments](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#modifiers)|NO||
|[Custom modifiers](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#custom-modifiers)|NO||
|[Multipaths](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#multipaths)|NO||
|[Literals](https://github.com/tidwall/gjson/blob/master/SYNTAX.md#literals)|NO||
|[JSON Lines](https://github.com/tidwall/gjson#json-lines)|NO||

> This table is taken from the docs of [gjson-py](https://github.com/volans-/gjson-py)

## Running the build

TypeScript build:

```shell
pnpm compile
```

Run tests:

```shell
pnpm test
```