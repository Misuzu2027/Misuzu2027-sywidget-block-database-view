import HomeSvelte from "@/components/home.svelte";
import "@/assets/icons/ant/icon.ts"
import "@/assets/icons/material/icon.ts"
import "./index.scss"

let appElement = document.getElementById("app");
new HomeSvelte({
    target: appElement
})
