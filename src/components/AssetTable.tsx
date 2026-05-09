import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { Asset } from '../hooks/useAssets';
import { LivePriceCell } from './LivePriceCell';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const columns = [
  { accessorKey: 'name', header: 'Asset' },
  { accessorKey: 'symbol', header: 'Symbol' },
  {
    accessorKey: 'priceUsd',
    header: 'Price',
    cell: ({ row }: any) => (
      <LivePriceCell assetId={row.original.id} basePrice={row.original.priceUsd} />
    ),
  },
  {
    accessorKey: 'changePercent24Hr',
    header: '24h Change',
    cell: (info: any) => {
      const val = parseFloat(info.getValue() || '0');
      return (
        <span className={val >= 0 ? 'text-emerald-400' : 'text-rose-400 font-medium'}>
          {val >= 0 ? '↑' : '↓'} {val.toFixed(2)}%
        </span>
      );
    },
  },
];

export const AssetTable: React.FC<{ assets: Asset[] }> = ({ assets }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: assets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),   // ← Added Pagination
    state: { 
      sorting, 
      globalFilter,
      pagination: { pageIndex: 0, pageSize: 10 }   // Default: 10 rows per page
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
      {/* Search */}
      <input
        type="text"
        placeholder="Search assets by name or symbol..."
        className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 mb-6 focus:outline-none focus:border-cyan-500 text-sm"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-slate-700">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-slate-200"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && <ArrowUpDown className="inline ml-1" size={15} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t border-slate-700 hover:bg-slate-800/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="py-5 px-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6 text-sm">
        <div className="text-slate-400">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, assets.length)} of{' '}
          {assets.length} assets
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="px-4 py-1 bg-slate-800 rounded-lg text-slate-300">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};