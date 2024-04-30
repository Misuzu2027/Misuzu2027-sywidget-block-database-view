import { isNotBlankStr } from "@/utils/stringUtil";

async function request(url: string, data?: any) {

    let responseData = await fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            Authorization: `Token `,
        }
    });
    let resData = await responseData.json();

    return resData.code === 0 ? resData.data : null;
}

// **************************************** Block ****************************************
type DataType = "markdown" | "dom";
export async function insertBlock(
    dataType: DataType, data: string,
    nextID?: BlockId, previousID?: BlockId, parentID?: BlockId
): Promise<IResdoOperations[]> {
    let payload = {
        dataType: dataType,
        data: data,
        nextID: nextID,
        previousID: previousID,
        parentID: parentID
    }
    let url = '/api/block/insertBlock';
    return request(url, payload);
}


export async function prependBlock(dataType: DataType, data: string, parentID: BlockId | DocumentId): Promise<IResdoOperations[]> {
    let payload = {
        dataType: dataType,
        data: data,
        parentID: parentID
    }
    let url = '/api/block/prependBlock';
    return request(url, payload);
}


export async function appendBlock(dataType: DataType, data: string, parentID: BlockId | DocumentId): Promise<IResdoOperations[]> {
    let payload = {
        dataType: dataType,
        data: data,
        parentID: parentID
    }
    let url = '/api/block/appendBlock';
    return request(url, payload);
}


export async function updateBlock(dataType: DataType, data: string, id: BlockId): Promise<IResdoOperations[]> {
    let payload = {
        dataType: dataType,
        data: data,
        id: id
    }
    let url = '/api/block/updateBlock';
    return request(url, payload);
}

export async function getDocInfo(
    blockId: BlockId
): Promise<any> {
    let data = { id: blockId }
    let url = '/api/block/getDocInfo';

    return request(url, data);
}


// **************************************** Attributes ****************************************
export async function setBlockAttrs(id: BlockId, attrs: { [key: string]: string }) {
    let data = {
        id: id,
        attrs: attrs
    }
    let url = '/api/attr/setBlockAttrs';
    return request(url, data);
}


export async function getBlockAttrs(id: BlockId): Promise<{ [key: string]: string }> {
    let data = {
        id: id
    }
    let url = '/api/attr/getBlockAttrs';
    return request(url, data);
}

// **************************************** SQL ****************************************

export async function sql(sql: string): Promise<any[]> {
    let sqldata = {
        stmt: sql,
    };
    let url = '/api/query/sql';
    return request(url, sqldata);
}

export async function getBlockByID(blockId: string): Promise<Block> {
    let sqlScript = `select * from blocks where id ='${blockId}'`;
    let data = await sql(sqlScript);
    return data[0];
}


// **************************************** Database ****************************************

export async function getAttributeViewKeys(id: string): Promise<AttributeViewKey[]> {
    if (!id) {
        return null;
    }
    return request('/api/av/getAttributeViewKeys', { id: id });
}


// **************************************** localStorage ****************************************

export async function setStorageVal(key: string, val: any) {
    let data = {
        app: Math.random().toString(36).substring(8),
        key,
        val,
    };
    return request('/api/storage/setLocalStorageVal', data);

};


export async function getLocalStorage(): Promise<{ [key: string]: any }> {

    return request('/api/storage/getLocalStorage', null);

};



/**
 * 复制 https://github.com/OpaqueGlass/listChildDocs/blob/827fb46afc1dd0c529766c1d74cd9242152a902d/src/API.js#L300
 * 获取当前文档id（伪api）
 * 优先使用jquery查询
 */
export async function getCurrentDocId(): Promise<string> {
    let thisDocId: string;
    let thisWidgetId = getCurrentWidgetId();

    //依靠widgetId sql查，运行时最稳定方案（但挂件刚插入时查询不到！）
    if (isNotBlankStr(thisWidgetId)) {
        try {
            let widgetBlockInfo = await getBlockByID(thisWidgetId);

            if (widgetBlockInfo && widgetBlockInfo.root_id) {
                thisDocId = widgetBlockInfo.root_id
                return thisDocId;
            }
        } catch (error) {
            console.log("获取文档idBy方案A失败", error);
        }
    }

    try {
        if (isNotBlankStr(thisWidgetId)) {
            //通过获取挂件所在页面题头图的data-node-id获取文档id【安卓下跳转返回有问题，原因未知】
            let thisDocId = window.top.document.querySelector(`div.protyle-content:has(.iframe[data-node-id="${thisWidgetId}"]) .protyle-background`).getAttribute("data-node-id");
            if (isNotBlankStr(thisDocId)) {
                console.log("获取当前文档idBy方案B" + thisDocId);
                return thisDocId;
            }
        }

    } catch (err) {
        console.error(err);
    }

    // 移动端文档id获取
    if (isMobile()) {
        let temp;
        try {
            // 先前是因为移动端background id更新不及时，所以使用了文档icon获取的方法
            temp = window.top.document.querySelector(".protyle-breadcrumb .protyle-breadcrumb__item .popover__block[data-id]")?.getAttribute("data-id");
            let iconArray = window.top.document.querySelectorAll(".protyle-breadcrumb .protyle-breadcrumb__item .popover__block[data-id]");
            for (let i = 0; i < iconArray.length; i++) {
                let iconOne = iconArray[i];
                if (iconOne.children.length > 0
                    && iconOne.children[0].getAttribute("xlink:href") == "#iconFile") {
                    temp = iconOne.getAttribute("data-id");
                    break;
                }
            }
            console.log("文档图标获取当前文档id", temp);
            thisDocId = temp;
        } catch (e) {
            console.error("通过文档图标获取当前文档id失败", e);
            temp = null;
        }
        if (!thisDocId) {
            thisDocId = window.top.document.querySelector(".protyle.fn__flex-1:not(.fn__none) .protyle-background")?.getAttribute("data-node-id");
            console.log("使用background的匹配值", thisDocId);
        }
        return thisDocId;
    }

    //widgetId不存在，则使用老方法（存在bug：获取当前展示的页面id（可能不是挂件所在的id））
    if (!isNotBlankStr(thisWidgetId)) {
        try {
            thisDocId = window.top.document.querySelector(".layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background").getAttribute("data-node-id");
            console.log("获取当前文档idBy方案C" + thisDocId);
        } catch (err) {
            console.error("获取当前文档id均失败");
            return null;
        }
        return thisDocId;
    }
    return null;
}

/**
 * 获取当前挂件id
 * @returns 
 */
export function getCurrentWidgetId() {
    try {
        if (!window.frameElement.parentElement.parentElement.dataset.nodeId) {
            return window.frameElement.parentElement.parentElement.dataset.id;
        } else {
            return window.frameElement.parentElement.parentElement.dataset.nodeId;
        }
    } catch (err) {
        return null;
    }
}

export function isMobile() {
    return window.top.document.getElementById("sidebar") ? true : false;
};




export async function getDefaultTargetBlockId(method: "RootBlock" | "PreviousBlock" | "NextBlock") {
    let targetBlockId;//目标任务列表块id
    let thisWidgetBlockElem = window.frameElement.parentElement.parentElement;

    switch (method) {
        case "RootBlock":
            targetBlockId = await getCurrentDocId();
            break;
        case "PreviousBlock":
            if (thisWidgetBlockElem.previousElementSibling) {
                targetBlockId = thisWidgetBlockElem.previousElementSibling.getAttribute("data-node-id");
            }
            break;
        case "NextBlock":
            if (thisWidgetBlockElem.nextElementSibling) {
                targetBlockId = thisWidgetBlockElem.nextElementSibling.getAttribute("data-node-id");
            }
            break;
    }

    return targetBlockId;
}



