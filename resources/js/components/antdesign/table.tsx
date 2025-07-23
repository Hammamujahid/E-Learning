/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table } from 'antd';

type SizeType = TableProps<any>['size'];
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition = NonNullable<TablePagination<any>['position']>[number];
type ExpandableConfig<T extends object> = TableProps<T>['expandable'];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

export interface AntdTableProps<T extends object> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
  bordered?: boolean;
  size?: SizeType;
  expandable?: ExpandableConfig<T>;
  showTitle?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  rowSelection?: TableRowSelection<T>;
  tableLayout?: string;
  top?: TablePaginationPosition;
  bottom?: TablePaginationPosition;
  ellipsis?: boolean;
  yScroll?: boolean;
  xScroll?: string;
  title?: () => React.ReactNode;
  footer?: () => React.ReactNode;
}

export function AntdTable<T extends object>({
  columns,
  data,
  loading = false,
  bordered = false,
  size = 'large',
  expandable,
  showTitle = false,
  showHeader = true,
  showFooter = true,
  rowSelection,
  tableLayout = 'unset',
  top = 'none',
  bottom = 'bottomRight',
  ellipsis = false,
  yScroll = false,
  xScroll = 'unset',
  title,
  footer,
}: AntdTableProps<T>) {
  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) scroll.y = 240;
  if (xScroll !== 'unset') scroll.x = '100vw';

  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }

  const tableProps: TableProps<T> = {
    bordered,
    loading,
    size,
    expandable,
    title: showTitle ? title : undefined,
    showHeader,
    footer: showFooter ? footer : undefined,
    rowSelection,
    scroll,
    tableLayout: tableLayout === 'unset' ? undefined : (tableLayout as TableProps['tableLayout']),
    pagination: { position: [top, bottom] },
    columns: tableColumns,
    dataSource: data,
  };

  return <Table<T> {...tableProps} />;
}
