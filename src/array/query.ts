// SPDX-FileCopyrightText: © 2023 woifes <https://github.com/woifes>
// SPDX-License-Identifier: MIT

import { handleNextLevel } from "../path/handleNextLevel";
import { splitPath } from "../path/splitPath";
import { createWildcardRegex } from "../path/wildcards";

const getQueryContentRegEx = /^#\((.*)\)#?$/;

/**
 * Takes the given data and applies the gjson array logic on it.
 * @param data the data for the query
 * @param query the query to apply
 * @returns result of the query
 */
export function queryArray(data: any, query: string): any {
    const queryContent = getQueryContent(query);
    if (!Array.isArray(data)) {
        throw new Error("Tried to query non array item");
    }
    const [a, op, b] = parseQuery(queryContent);
    if (op === "") {
        //Query has to be further evaluated
        const nextPaths = splitPath(a);
        return data.filter((item) => {
            //TODO verify of this is the right way to evaluate this.
            return Boolean(handleNextLevel(item, nextPaths));
        });
    }
    const predicate = predicateFactory(a, op, b);
    return data.filter(predicate);
}

/**
 * Takes a given query string of the form #(...) or #(...)# and returns the content between the outer bracket pair
 * @param path the valid query string
 * @returns
 */
function getQueryContent(path: string): string {
    return path.match(getQueryContentRegEx)![1];
}

/**
 * Splits the array query by left, and right path of the query.
 * Assumes the query is already the part inside the #(...) or #(...)#
 * @param query
 * @returns
 */
function parseQuery(query: string): [string, string, string] {
    let i = 0;
    let j = -1;
    let bracketDepth = 0;
    for (; i < query.length; i++) {
        const char = query[i];

        if (bracketDepth === 0 && j === -1) {
            switch (char) {
                case "!":
                case "=":
                case "<":
                case ">":
                case "%":
                    j = i;
                    continue;
            }
        }

        if (char === "\\") {
            i++;
        } else if (char === "(") {
            bracketDepth++;
        } else if (char === ")") {
            bracketDepth--;
            if (bracketDepth === 0) {
                break;
            }
        }
    }
    if (bracketDepth > 0) {
        throw new Error("No balanced brackets");
    }
    if (j > -1) {
        const left = query.slice(0, j);
        const right = query.substring(j);
        const operator = "";
        if (
            right.startsWith("!=") ||
            right.startsWith("!%") ||
            right.startsWith("<=") ||
            right.startsWith(">=") ||
            right.startsWith("==")
        ) {
            return [left, right.slice(0, 2), right.substring(2)];
        }
        return [left, right.slice(0, 1), right.substring(1)];
    } else {
        return [query, "", ""];
    }
}

/**
 * Uses the given operants or operators to return a predicate function which can be used as a array.filter callback.
 * e. g. operantA > operantB
 * @param operantA the left side operant
 * @param operator the operator to use (e. g. ">=", "<=", ...)
 * @param operantB the right side operant
 * @returns
 */
function predicateFactory(
    operantA: string,
    operator: string,
    operantB: string,
): (item: any) => boolean {
    operantB = JSON.parse(operantB); //convert to json value
    switch (operator) {
        case "==":
            return (item: any) => {
                if (operantA.length > 0) {
                    //if the left side operant is empty, the array element itself is used for the check.
                    //If not, the value has to be searched by gjson logic
                    const paths = splitPath(operantA);
                    item = handleNextLevel(item, paths);
                }
                //biome-ignore lint/suspicious/noDoubleEquals: is needed here
                return item == operantB;
            };
        case "!=":
            return (item: any) => {
                if (operantA.length > 0) {
                    const paths = splitPath(operantA);
                    item = handleNextLevel(item, paths);
                }
                //biome-ignore lint/suspicious/noDoubleEquals: is needed here
                return item != operantB;
            };
        case ">":
            return (item: any) => {
                if (operantA.length > 0) {
                    const paths = splitPath(operantA);
                    item = handleNextLevel(item, paths);
                }
                return item > operantB;
            };
        case "<":
            return (item: any) => {
                if (operantA.length > 0) {
                    const paths = splitPath(operantA);
                    item = handleNextLevel(item, paths);
                }
                return item < operantB;
            };
        case ">=":
            return (item: any) => {
                if (operantA.length > 0) {
                    const paths = splitPath(operantA);
                    item = handleNextLevel(item, paths);
                }
                return item >= operantB;
            };
        case "<=":
            return (item: any) => {
                if (operantA.length > 0) {
                    const paths = splitPath(operantA);
                    item = handleNextLevel(item, paths);
                }
                return item <= operantB;
            };
        case "!%": {
            const wildcardRegex = createWildcardRegex(operantB); //In the "like" operator wildcards are allowed.
            return (item: any) => {
                if (operantA.length > 0) {
                    const paths = splitPath(operantA);
                    item = handleNextLevel(item, paths);
                }
                return !(item.match(wildcardRegex) !== null);
            };
        }
        case "%": {
            const wildcardRegex = createWildcardRegex(operantB);
            return (item: any) => {
                if (operantA.length > 0) {
                    const paths = splitPath(operantA);
                    item = handleNextLevel(item, paths);
                }
                return item.match(wildcardRegex) !== null;
            };
        }
    }
    throw new Error(`Operator not implemented: ${operator}`);
}
