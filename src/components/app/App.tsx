import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import MainPage from 'pages/main';
import EnteringBalancePage from 'pages/entering-balance';
import EditEnteringBalancePage from 'pages/edit-entering-balance';
import OrdersPage from 'pages/orders';
import PurchaseInvoicePage from 'pages/purchase-invoice';
import EditPurchaseInvoicePage from 'pages/edit-purchase-invoice';
import SalesInvoicePage from 'pages/sales-invoice';
import EditSalesInvoicePage from 'pages/edit-sales-invoice';
import ReportsPage from 'pages/reports';
import InventoryPage from 'pages/inventory';
import EditInventoryPage from 'pages/edit-inventory';
import StoragePage from 'pages/storage';
import DrugLabelingPage from 'pages/drug-labeling';

import Header from 'components/header';
import { ROOT_APP_PATH } from 'constants/general';

export default (): JSX.Element => (
    <BrowserRouter>
        <Header />
        <Route
            path={`${ROOT_APP_PATH}`}
            exact
        >
            <MainPage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/entering_balance`}
            exact
        >
            <EnteringBalancePage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/entering_balance/edit`}
            exact
        >
            <EditEnteringBalancePage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/orders`}
            exact
        >
            <OrdersPage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/purchase_invoice`}
            exact
        >
            <PurchaseInvoicePage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/purchase_invoice/edit`}
            exact
        >
            <EditPurchaseInvoicePage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/sales_invoice`}
            exact
        >
            <SalesInvoicePage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/sales_invoice/edit`}
            exact
        >
            <EditSalesInvoicePage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/reports`}
            exact
        >
            <ReportsPage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/inventory`}
            exact
        >
            <InventoryPage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/inventory/edit`}
            exact
        >
            <EditInventoryPage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/storage`}
            exact
        >
            <StoragePage />
        </Route>
        <Route
            path={`${ROOT_APP_PATH}/drug_labeling`}
            exact
        >
            <DrugLabelingPage />
        </Route>
    </BrowserRouter>
);
