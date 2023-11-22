// SPDX-FileCopyrightText: © 2023 woifes <https://github.com/woifes>
// SPDX-License-Identifier: MIT

import { handleNextLevel } from "./path/handleNextLevel";
import { splitPath } from "./path/splitPath";

/**
 * The function searches in the given data for values via the GJSON path syntax
 * @param data the data to search in. Can be a string which gets parsed to JSON or JS object.
 * @param path the GJSON search path
 * @returns
 */
export function get(data: any, path: string) {
    let dataObj: any;
    if (typeof data === "string") {
        dataObj = JSON.parse(data);
    } else {
        dataObj = data;
    }

    const pathItems = splitPath(path);
    try {
        return handleNextLevel(dataObj, pathItems);
    } catch {
        return undefined;
    }
}
