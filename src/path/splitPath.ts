// SPDX-FileCopyrightText: © 2023 woifes <https://github.com/woifes>
// SPDX-License-Identifier: MIT

/**
 * Splits the given gjson path and splits it by the delimiters.
 * The splitting is done on the first hierarchical level (no subqueries are taken into account)
 * @param path the path to split
 * @returns array of path elements
 */
export function splitPath(path: string): string[] {
    const items: string[] = [];
    let nextItem: string;
    let rest: string | undefined = path;
    do {
        [nextItem, rest] = splitNextItem(rest);
        items.push(nextItem);
    } while (rest !== undefined);
    return items;
}

/**
 * Goes through the gjson path and splits the next item of it
 * @param path the path to split
 * @returns
 */
function splitNextItem(path: string): [string, string?] {
    if (path.startsWith("#(")) {
        return splitArrayQuery(path);
    }

    //TODO implement modifier splitting

    return splitUpToNextDelimiter(path);
}

/**
 * It is assumed that path will be an array query
 * @param path
 */
function splitArrayQuery(path: string): [string, string?] {
    let i = 2;
    let openingBracketCount = 1;
    let closingBracketCount = 0;
    for (; i < path.length; i++) {
        const char = path[i];
        switch (char) {
            case "\\":
                i++;
                break;
            case "(":
                openingBracketCount++;
                break;
            case ")":
                closingBracketCount++;
                break;
        }
        if (openingBracketCount === closingBracketCount) {
            const item1 = path.slice(0, i);
            const rest1 = path.substring(i);
            const [item2, rest2] = splitUpToNextDelimiter(rest1);
            return [item1 + item2, rest2];
        }
    }
    throw new Error("Did not find matching array query brackets");
}

function splitUpToNextDelimiter(path: string): [string, string?] {
    //TODO may not start with delemiter
    let i = 0;
    for (; i < path.length; i++) {
        const char = path[i];
        switch (char) {
            case "\\":
                i++; //ignore next character
                break;
            case ".":
            case "|": {
                const item = path.slice(0, i);
                const rest = path.substring(i + 1);
                return [item, rest];
            }
        }
    }
    return [path];
}
