// SPDX-FileCopyrightText: © 2023 woifes <https://github.com/woifes>
// SPDX-License-Identifier: MIT

import { get } from "../src/gjson";

const exampleJson = {
    name: { first: "Tom", last: "Anderson" },
    age: 37,
    children: ["Sara", "Alex", "Jack"],
    "fav.movie": "Deer Hunter",
    friends: [
        {
            first: "Dale",
            last: "Murphy",
            age: 44,
            nets: ["ig", "fb", "tw"],
        },
        { first: "Roger", last: "Craig", age: 68, nets: ["fb", "tw"] },
        { first: "Jane", last: "Murphy", age: 47, nets: ["ig", "tw"] },
    ],
};

it("should print correct path examples", () => {
    expect(get(exampleJson, "name.last")).toBe("Anderson");
    expect(get(exampleJson, "age")).toBe(37);
    expect(get(exampleJson, "children")).toEqual(["Sara", "Alex", "Jack"]);
    expect(get(exampleJson, "children.#")).toBe(3);
    expect(get(exampleJson, "children.1")).toBe("Alex");
    expect(get(exampleJson, "child*.2")).toBe("Jack");
    expect(get(exampleJson, "c?ildren.0")).toBe("Sara");
    expect(get(exampleJson, "fav\\.movie")).toBe("Deer Hunter");
    expect(get(exampleJson, "friends.#.first")).toEqual([
        "Dale",
        "Roger",
        "Jane",
    ]);
    expect(get(exampleJson, "friends.1.last")).toBe("Craig");
});

it("should print correct array query examples", () => {
    expect(get(exampleJson, 'friends.#(last=="Murphy").first')).toEqual("Dale");
    expect(get(exampleJson, 'friends.#(last=="Murphy")#.first')).toEqual([
        "Dale",
        "Jane",
    ]);
    expect(get(exampleJson, "friends.#(age>45)#.last")).toEqual([
        "Craig",
        "Murphy",
    ]);
    expect(get(exampleJson, 'friends.#(first%"D*").last')).toEqual("Murphy");
    expect(get(exampleJson, 'friends.#(first!%"D*").last')).toEqual("Craig");
    expect(get(exampleJson, 'friends.#(nets.#(=="fb"))#.first')).toEqual([
        "Dale",
        "Roger",
    ]);
});
