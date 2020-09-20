import { combineReducers } from 'redux';

import nomenclatureCards from './nomenclature-card/fetch-nomenclature-cards/reducer';
import createNomenclature from './nomenclature-card/create-nomenclature-card/reducer';

import purchaseInvoices from './purchase-invoice/fetch-purchase-invoices/reducer';
import createPurchaseInvoice from './purchase-invoice/create-purchase-invoice/reducer';
import deletePurchaseInvoice from './purchase-invoice/delete-purchase-invoice/reducer';
import updatePurchaseInvoice from './purchase-invoice/update-purchase-invoice/reducer';

import balanceInvoices from './balance-invoice/fetch-balance-invoices/reducer';
import createBalanceInvoice from './balance-invoice/create-balance-invoice/reducer';
import deleteBalanceInvoice from './balance-invoice/delete-balance-invoice/reducer';
import updateBalanceInvoice from './balance-invoice/update-balance-invoice/reducer';

import inventories from './inventory/fetch-inventories/reducer';
import createInventory from './inventory/create-inventory/reducer';
import deleteInventory from './inventory/delete-inventory/reducer';
import updateInventory from './inventory/update-inventory/reducer';

import storage from './storage/fetch-storage-data/reducer';

import tradeNames from './dictionaries/fetch-trade-names/reducer';
import taxRates from './dictionaries/fetch-tax-rates/reducer';
import consignors from './dictionaries/fetch-consignors/reducer';
import consignees from './dictionaries/fetch-consignees/reducer';
import fundingSources from './dictionaries/fetch-funding-sources/reducer';
import warehouses from './dictionaries/fetch-warehouses/reducer';
import branches from './dictionaries/fetch-branches/reducer';
import storeReasons from './dictionaries/fetch-store-reasons/reducer';
import members from './dictionaries/fetch-members/reducer';

import expirationDate from './reports/expiration-date/reducer';

import warehouseBranch from './dictionaries/fetch-warehouse-branch/reducer';
import writeOfReason from './dictionaries/fetch-write-of-reason/reducer';
import storageSalesInvoice from './dictionaries/fetch-storage/reducer';
import addedSalesInvoiceNameclature from './namenclature-sales-invoice-data/reducer';

import createSalesInvoice from './sales-invoice/create-sales-invoice/reducer';
import deleteSalesInvoice from './sales-invoice/delete-sales-invoice/reducer';
import updateSalesInvoice from './sales-invoice/update-sales-invoice/reducer';

import salesInvoice from './sales-invoice/fetch-sales-invoices/reducer';

const rootReducer = combineReducers({
    dictionaries: combineReducers({
        consignors,
        consignees,
        tradeNames,
        taxRates,
        fundingSources,
        warehouses,
        branches,
        storeReasons,
        members,

        warehouseBranch,
        writeOfReason,
        storageSalesInvoice,
        addedSalesInvoiceNameclature,
    }),
    nomenclatureCards,
    purchaseInvoices,
    balanceInvoices,
    inventories,
    storage,
    salesInvoice,
    reports: combineReducers({
        expirationDate,
    }),
    actions: combineReducers({
        createNomenclature,
        createPurchaseInvoice,
        deletePurchaseInvoice,
        updatePurchaseInvoice,
        createBalanceInvoice,
        deleteBalanceInvoice,
        updateBalanceInvoice,
        createInventory,
        deleteInventory,
        updateInventory,
        createSalesInvoice,
        deleteSalesInvoice,
        updateSalesInvoice,
    }),
});

export type TRootState = ReturnType<typeof rootReducer>

export default rootReducer;
