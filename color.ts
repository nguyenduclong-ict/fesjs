import colors from "@/constant/colors";
import sample from "lodash/sample";

declare type ColorName =
    | "red"
    | "pink"
    | "purple"
    | "deepPurple"
    | "indigo"
    | "blue"
    | "lightBlue"
    | "cyan"
    | "teal"
    | "green"
    | "lightGreen"
    | "lime"
    | "yellow"
    | "amber"
    | "orange"
    | "deepOrange"
    | "brown"
    | "grey"
    | "blueGrey"
    | "darkText"
    | "lightText"
    | "darkIcons"
    | "lightIcons"
    | "white"
    | "black";

export function getColor(name: ColorName, range = "500") {
    return colors[name][range] || colors[name];
}

export function randomColor() {
    return getColor(sample(Object.entries(colors).map((c) => c[0])) as any);
}
