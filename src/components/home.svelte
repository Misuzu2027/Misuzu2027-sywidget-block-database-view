<script lang="ts">
    import BlockDatabaseViewSvelte from "@/components/view/block-database-view.svelte";
    import BlockBuiltInAttrViewSvelte from "@/components/view/block-built-in-attr-view.svelte";
    import BlockCustomAttrViewSvelte from "@/components/view/block-custom-attr-view.svelte";
    import { afterUpdate, onMount } from "svelte";
    import { getAttributeViewKeys } from "@/utils/api";
    import {
        AttributeTableDto,
        TabType,
    } from "@/structures/AttributeTableStructure";
    import { SettingConfig } from "@/config/setting-config";
    import { refreshCssLink } from "@/utils/htmlUtil";
    import SettingView from "./view/setting-view.svelte";
    import { processAttributeData } from "@/services/block-database";
    import { openRefLink } from "@/utils/ref-util";

    let allTableDtoMap: Map<string, AttributeTableDto> = new Map();
    let selectTableDto: AttributeTableDto;
    let selectTabType: TabType;
    let selectAttributeTabId: string;
    let avTabClickCount = 0;
    let showBuiltInAttr = false;
    let showCustomAttr = false;

    onMount(() => {
        init();
    });

    // 当发生变化时重新渲染，并在渲染完成后执行afterRender函数
    $: {
        afterUpdate(afterRender);
    }

    function afterRender() {
        setFrameHeight();
        setTimeout(() => {
            setFrameHeight();
        }, 120);
    }

    async function init() {
        // const startTime = performance.now(); // 记录开始时间
        await SettingConfig.ins.load();

        allTableDtoMap = new Map();
        refreshCssLink();
        selectTabType = SettingConfig.ins.widgetSettingDto.lastSelectTabType;
        selectAttributeTabId =
            SettingConfig.ins.widgetSettingDto.lastSelectAvId;
        showBuiltInAttr = SettingConfig.ins.widgetSettingDto.showBuiltInAttr;
        showCustomAttr = SettingConfig.ins.widgetSettingDto.showCustomAttr;

        await refreshBlockAttributeData();

        // const endTime = performance.now(); // 记录结束时间
        // const executionTime = endTime - startTime; // 计算时间差
        // console.log(`初始化消耗时间 : ${executionTime} ms`);
    }

    async function refreshBlockAttributeData() {
        let targetBlockId = SettingConfig.ins.widgetSettingDto.targetBlockId;
        let attributeViewKeys: AttributeViewKey[] =
            await getAttributeViewKeys(targetBlockId);

        let tableDtos = processAttributeData(attributeViewKeys);
        refreshAttributeTable(tableDtos);
        initSelectTab();
    }

    function refreshAttributeTable(
        tableDtoMap: Map<string, AttributeTableDto>,
    ) {
        if (tableDtoMap && tableDtoMap.size > 0) {
            allTableDtoMap = tableDtoMap;
            selectTableDto = allTableDtoMap.get(selectAttributeTabId);
            if (!selectTableDto) {
                selectTableDto = allTableDtoMap.values().next().value;
            }
            selectAttributeTabId = selectTableDto.avId;
        }
    }

    function initSelectTab() {
        if (!selectTabType) {
            if (selectTableDto) {
                selectTabType = TabType.DATABASE_ATTR_TAB;
            } else if (showBuiltInAttr) {
                selectTabType = TabType.BUILT_IN_ATTR_TAB;
            } else if (showCustomAttr) {
                selectTabType = TabType.CUSTOM_ATTR_TAB;
            } else {
                selectTabType = TabType.SETTINGS_TAB;
            }
        }
        if (selectTabType == TabType.DATABASE_ATTR_TAB && !selectTableDto) {
            selectTabType = null;
            initSelectTab();
        }
        if (selectTabType == TabType.BUILT_IN_ATTR_TAB && !showBuiltInAttr) {
            selectTabType = null;
            initSelectTab();
        }
        if (selectTabType == TabType.CUSTOM_ATTR_TAB && !showCustomAttr) {
            selectTabType = null;
            initSelectTab();
        }
    }

    function setFrameHeight() {
        let contentHeight = document.getElementById("app").offsetHeight + 20;
        if (SettingConfig.ins.widgetCollapsed) {
            contentHeight =
                document.getElementById("top-navigation-bar").offsetHeight + 20;
        }
        if (contentHeight <= 30) {
            return;
        }
        let frameElement = window.frameElement as HTMLElement;
        frameElement.style.height = contentHeight + "px";
        frameElement.style.width = "2048px";
    }

    function clickTab(event: MouseEvent, tabType: TabType) {
        if (tabType == TabType.REFRESH_TAB) {
            let clickElement = event.currentTarget as HTMLElement;
            let className = "item--focus";
            setTimeout(() => {
                clickElement.classList.remove(className);
            }, 100);
            init();
        } else if (tabType == TabType.COLLAPSED_TAB) {
            let clickElement = event.currentTarget as HTMLElement;
            let className = "item--focus";
            setTimeout(() => {
                clickElement.classList.remove(className);
            }, 100);
            SettingConfig.ins.widgetCollapsed =
                !SettingConfig.ins.widgetCollapsed;
            afterRender();
        } else if (tabType == TabType.SETTINGS_TAB) {
            selectTabType = tabType;
            selectTableDto = null;
        } else if (tabType == TabType.BUILT_IN_ATTR_TAB) {
            selectTabType = tabType;
            selectTableDto = null;
            SettingConfig.ins.widgetSettingDto.lastSelectTabType = tabType;
            SettingConfig.ins.update(SettingConfig.ins.widgetSettingDto);
        } else if (tabType == TabType.CUSTOM_ATTR_TAB) {
            selectTabType = tabType;
            selectTableDto = null;
            SettingConfig.ins.widgetSettingDto.lastSelectTabType = tabType;
            SettingConfig.ins.update(SettingConfig.ins.widgetSettingDto);
        }
    }

    function clickAttributeTab(
        event: MouseEvent,
        tabType: TabType,
        avId: string,
    ) {
        if (tabType != TabType.DATABASE_ATTR_TAB) {
            return;
        }
        avTabClickCount++;

        if (avTabClickCount === 1) {
            selectTabType = tabType;
            selectAttributeTabId = avId;
            SettingConfig.ins.widgetSettingDto.lastSelectAvId = avId;
            SettingConfig.ins.widgetSettingDto.lastSelectTabType = tabType;
            SettingConfig.ins.update(SettingConfig.ins.widgetSettingDto);
            refreshBlockAttributeData();
            setTimeout(() => {
                avTabClickCount = 0; // 重置计数
            }, 210);
        }
        if (
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            avTabClickCount === 2
        ) {
            let dto: AttributeTableDto = allTableDtoMap.get(avId);
            let blockId = dto.blockIds[0];
            // 打开存在该数据库的节点
            openRefLink(event, blockId);
            avTabClickCount = 0; // 重置计数
        }
    }

    function handleKeyDownDefault() {}
</script>

<div class="fn__flex">
    <ul id="top-navigation-bar" class="fn__flex layout-tab-bar">
        <li
            class="item"
            on:mousedown={(event) => {
                let clickElement = event.currentTarget;
                let className = "item--focus";
                clickElement.classList.add(className);
            }}
            on:keydown={handleKeyDownDefault}
            on:click={(event) => {
                clickTab(event, TabType.REFRESH_TAB);
            }}
        >
            <span class="block__icon block__icon--show">
                <svg><use xlink:href="#iconRefresh"></use></svg>
            </span>
            <span class="item__text" style="padding-left:0px;">刷新</span>
        </li>
        <li
            class="item"
            on:mousedown={(event) => {
                let clickElement = event.currentTarget;
                let className = "item--focus";
                clickElement.classList.add(className);
            }}
            on:keydown={handleKeyDownDefault}
            on:click={(event) => {
                clickTab(event, TabType.COLLAPSED_TAB);
            }}
        >
            {#if SettingConfig.ins.widgetCollapsed}
                <span class="block__icon block__icon--show">
                    <svg><use xlink:href="#iconExpand"></use></svg>
                </span>
                <span class="item__text" style="padding-left:0px;">展开</span>
            {:else}
                <span class="block__icon block__icon--show">
                    <svg><use xlink:href="#iconContract"></use></svg>
                </span>
                <span class="item__text" style="padding-left:0px;">折叠</span>
            {/if}
        </li>
        <li
            class="item {selectTabType == TabType.SETTINGS_TAB
                ? 'item--focus'
                : ''}"
            on:click={(event) => {
                clickTab(event, TabType.SETTINGS_TAB);
            }}
            on:keydown={handleKeyDownDefault}
        >
            <span class="block__icon block__icon--show">
                <svg><use xlink:href="#iconSettings"></use></svg>
            </span>
            <span class="item__text" style="padding-left:0px;">设置</span>
        </li>

        <li class="vertical-separator"></li>

        {#if showBuiltInAttr}
            <li
                class="item {selectTabType == TabType.BUILT_IN_ATTR_TAB
                    ? 'item--focus'
                    : ''}"
                on:click={(event) => {
                    clickTab(event, TabType.BUILT_IN_ATTR_TAB);
                }}
                on:keydown={handleKeyDownDefault}
            >
                <span class="item__text">内置属性</span>
            </li>
        {/if}

        {#if showCustomAttr}
            <li
                class="item {selectTabType == TabType.CUSTOM_ATTR_TAB
                    ? 'item--focus'
                    : ''}"
                on:click={(event) => {
                    clickTab(event, TabType.CUSTOM_ATTR_TAB);
                }}
                on:keydown={handleKeyDownDefault}
            >
                <span class="item__text">自定义属性</span>
            </li>
        {/if}

        {#if showBuiltInAttr || showCustomAttr}
            <li class="vertical-separator"></li>
        {/if}

        {#each Array.from(allTableDtoMap) as [key, item]}
            <li
                class="item {selectTabType == TabType.DATABASE_ATTR_TAB &&
                selectAttributeTabId == key
                    ? 'item--focus'
                    : ''} "
                on:click={(event) => {
                    clickAttributeTab(event, TabType.DATABASE_ATTR_TAB, key);
                }}
                on:keydown={handleKeyDownDefault}
            >
                <span class="item__text">{item.avName}</span>
            </li>
        {/each}
    </ul>
</div>
<div id="main-content-container">
    {#if !SettingConfig.ins.widgetCollapsed}
        {#if selectTabType == TabType.SETTINGS_TAB}
            <SettingView />
        {/if}
        {#if selectTabType == TabType.BUILT_IN_ATTR_TAB}
            <BlockBuiltInAttrViewSvelte />
        {/if}
        {#if selectTabType == TabType.CUSTOM_ATTR_TAB}
            <BlockCustomAttrViewSvelte />
        {/if}

        {#if selectTabType == TabType.DATABASE_ATTR_TAB && selectTableDto}
            <BlockDatabaseViewSvelte tableDto={selectTableDto} />
        {/if}
    {/if}
</div>

<style>
    .vertical-separator {
        border-left: 1px solid #ccc; /* 设置竖直分割线为实线，颜色为灰色 */
        height: 30px; /* 设置分割线的高度 */
        margin: 0 10px; /* 设置左右间距 */
    }
    #top-navigation-bar {
        height: 45px;
    }
</style>
