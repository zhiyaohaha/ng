import { ITdDataTableColumn, TdDataTableService } from '@covalent/core';


export class TableSearch {

    /**
     * 
     * @param options 
     *   data:  需要处理的原数据
     *   columns: 元数据表头
     *   fromRow: 从第一行开始
     *   currentPage: 当前页
     *   pageSize: 每页行数
     *   sortBy: 排序列的名字
     *   sortOrder: 固定值
     *   dataTableService: 固定值
     */
    public tableFilter(options) {
        let newData: any[] = options.data;
        let excludedColumns: string[] = options.columns
            .filter((column: ITdDataTableColumn) => {
                return ((column.filter === undefined && column.hidden === true) ||
                    (column.filter !== undefined && column.filter === false));
            }).map((column: ITdDataTableColumn) => {
                return column.name;
            });
        newData = options.dataTableService.filterData(newData, options.searchTerm, true, excludedColumns);
        let total = newData.length;
        newData = options.dataTableService.sortData(newData, options.sortBy, options.sortOrder);
        newData = options.dataTableService.pageData(newData, options.fromRow, options.currentPage * options.pageSize);
        return [newData, total];
    }
}