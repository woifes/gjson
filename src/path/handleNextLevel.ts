// SPDX-FileCopyrightText: © 2023 woifes <https://github.com/woifes>
// SPDX-License-Identifier: MIT

import { queryArray } from "../array/query";
//import { queryArray } from "../array/query";
import { createWildcardRegex } from "./wildcards";

/**
 * Handles the next hierarchical level of the gjson path search
 * @param data the data to operate on
 * @param path the path to apply
 * @returns
 */
export function handleNextLevel(data: any, path: string[]): any {
    if (path.length === 0) {
        //breakout condition
        return data;
    }
    const [nextPathItem, ...rest] = path;
    if (nextPathItem.startsWith("#(")) {
        data = queryArray(data, nextPathItem);

        if (nextPathItem.endsWith("#")) {
            return handleNextLevelArray(data, rest);
        }
        return handleNextLevel(data[0], rest);
    } else if (nextPathItem.startsWith("#")) {
        if (Array.isArray(data)) {
            if (rest.length === 0) {
                //if the gjson path ends with ".#" return the array size
                return data.length;
            } else {
                //evaluate the next path for every element of the array
                return handleNextLevelArray(data, rest);
            }
        }
        throw new Error(`Tried to use array logic on ${data}`);
    }
    //TODO modifier handling

    //if it is a regular path element create a regex which takes the used wildcards into account.
    const itemRegEx = createWildcardRegex(nextPathItem);
    //TODO check if returning the first key which matches is the right way of evaluating this.
    const itemKey = Object.keys(data).find((key) => {
        return key.match(itemRegEx) !== null;
    });
    if (itemKey === undefined) {
        throw Error(`Item ${nextPathItem} not found`);
    }
    return handleNextLevel(data[itemKey], rest);
}

/**
 * Array version of the handleNextLevel function.
 * @param data the data to operate on
 * @param path the gjson path
 * @returns
 */
function handleNextLevelArray(data: any[], path: string[]): any[] {
    return data.map((item: any) => {
        return handleNextLevel(item, [...path]);
    });
}
