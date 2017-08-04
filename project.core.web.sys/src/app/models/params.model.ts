import { ITdDataTableColumn } from '@covalent/core';
export class ParamsModel {

    /**
     * 总条数
     */
    total: number;

    /**
     * 数据类容
     */
    data: ParamsDataModel;
}

export class ParamsDataModel {

    /**
     * 绑定的数据
     */
    bindData: any;

    /**
     * 表头信息
     */
    fields: ITdDataTableColumn[];

    /**
     * 过滤信息
     */
    filters: ParamsFiltersModel[];
}

export class ParamsBindDataModel {

    /**
     * HttpCode
     */
    Code: string;

    /**
     * 数据的ID
     */
    Id: string;

    /**
     * Http回调码
     */
    Name: string;

    /**
     * 排序码
     */
    Sort: number;

    /**
     * 数据内容
     */
    Childrens: ParamsBindDataChildrenModel;

}

export class ParamsBindDataChildrenModel {

    /**
     * 子集
     */
    Childrens: string[];

    /**
     * HTTP返回码
     */
    Code: string;

    /**
     * 深度
     */
    Depth: number;

    /**
     * 描述
     */
    Description: string;

    /**
     * HTTP状态码对应的返回值
     */
    Name: string;

    /**
     * 排序
     */
    Sort: number;
}

export class ParamsFieldsModel {

    /**
     * 是否筛选
     */
    filter: boolean = false;

    /**
     * 格式方法
     */
    format: (value: any) => any;

    /**
     * 是否显示
     */
    hidden: boolean = false;

    /**
     * 显示字段 表头
     */
    label: string;

    /**
     * 绑定字段
     */
    name: string;

    /**
     * 是否数值
     */
    numeric: boolean = false;

    /**
     * 是否排序
     */
    sortable: boolean = false;

    /**
     * 提示
     */
    tooltip: string;
}

export class ParamsFiltersModel {

    /**
     * 绑定字段
     */
    name: string;

    /**
     * 绑定字段
     */
    bindField: string[];

    /**
     * 筛选类型
     */
    filterType: string;

    /**
     * 值
     */
    value: string;

    /**
     * 绑定数据
     */
    bindData: object;

    /**
     * 绑定数据类型
     */
    bindDataType: string;

    /**
     * 页面搜索的条件内容
     */
    ui: UIModel;

}

export class UIModel {
    /**
     * 标题
     */
    label: string;

    /**
     * 展示类型
     */
    displayType: string;

    /**
     * 是否禁用
     */
    isDisabled: boolean;

    /**
     * 是否显示
     */
    isHidden: boolean;

    /**
     * 占位符
     */
    placeholder: string;
}