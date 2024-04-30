<script lang="ts">
    import { afterUpdate } from "svelte";
    import { AttributeTableDto } from "@/structures/AttributeTableStructure";
    import { SettingConfig } from "@/config/setting-config";
    import { openRefLink } from "@/utils/ref-util";

    export let tableDto: AttributeTableDto;
    let rowFlexBasisPercent = "99%";

    $: {
        afterUpdate(afterRender);
    }

    function afterRender() {
        let columns = SettingConfig.ins.widgetSettingDto.columns;
        let rowFlexBasis = 100 / columns - 2.1;
        rowFlexBasisPercent = rowFlexBasis + "%";

        setFrameHeight();
        setTimeout(() => {
            setFrameHeight();
        }, 120);
    }

    function setFrameHeight() {
        let contentHeight = document.getElementById("app").offsetHeight + 20;
        if (SettingConfig.ins.widgetCollapsed) {
            contentHeight =
                document.getElementById("top-navigation-bar").offsetHeight + 20;
        }

        let frameElement = window.frameElement as HTMLElement;
        frameElement.style.height = contentHeight + "px";
        frameElement.style.width = "2048px";
    }

    function contentClick(event) {
        let clickElement = event.target;
        if (
            !clickElement.hasAttribute("data-type") ||
            clickElement.getAttribute("data-type") !== "block-ref"
        ) {
            return;
        }
        // 检查元素是否存在 data-id 属性
        if (!clickElement.hasAttribute("data-id")) {
            return;
        }
        let blockId = clickElement.getAttribute("data-id");
        openRefLink(event, blockId);
    }

    function handleKeyDownDefault() {}
    /**
     *
     */
</script>

<div class="document-properties" style="display:flex;flex-wrap: wrap;">
    {#each tableDto.attributes as item (item.id)}
        <div
            class="block__icons av__row"
            style="flex-basis:{rowFlexBasisPercent}"
        >
            <div class="block__logo">
                {@html item.icon}
                <span class="text-white-space-wrap">{@html item.name}</span>
            </div>
            <div
                class="fn__flex-1 fn__flex block__logo-content"
                on:click={contentClick}
                on:keydown={handleKeyDownDefault}
            >
                {@html item.content}
                <!-- <div class="fn__flex-1">{@html item.content}</div> -->
            </div>
        </div>
    {/each}
</div>

<style>
    .av__row {
        flex: 1 0;
        border-bottom: 1px solid var(--b3-theme-on-background);
        border-image: linear-gradient(
                to right,
                transparent,
                var(--b3-theme-on-background),
                transparent
            )
            1;
        padding-bottom: 4px;
        margin-top: 4px;
    }
    .block__logo-content {
        width: 120px;
        align-self: center;
        margin-top: 2px;
        flex-wrap: wrap;
    }
</style>
