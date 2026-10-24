import {createBrowserRouter, Navigate} from 'react-router';
import {lazy} from 'react';
import {ShopLayout} from './shop/layouts/ShopLayout';
import {HomePage} from './shop/pages/home/HomePage';
import {StorePage} from './shop/pages/store/StorePage';
import {ProductPage} from './shop/pages/product/ProductPage';
import {LoginPage} from './auth/pages/login/LoginPage';
import {DashboardPage} from './admin/pages/dashboard/DashboardPage';
import {AboutPage} from './shop/pages/about/AboutPage';
import {AdminProductsPage} from './admin/pages/products/AdminProductsPage';
import {CreateProductPage} from './admin/pages/products/CreateProductPage';
import {AdminProductPage} from './admin/pages/product/AdminProductPage';
import {CreateProductVariantPage} from './admin/pages/product/variants/CreateProductVariantPage';
import {EditProductVariantPage} from './admin/pages/product/variants/EditProductVariantPage';
import {
	AuthenticatedRoute,
	NotAuthenticatedRoute,
} from './components/routes/ProtectedRoutes';
import {AdminCategoriesPage} from './admin/pages/categories/AdminCategoriesPage';
import {CreateCategoryPage} from './admin/pages/categories/CreateCategoryPage';
import {EditCategoryPage} from './admin/pages/categories/EditCategoryPage';
import {AdminBrandsPage} from './admin/pages/brands/AdminBrandsPage';
import {CreateBrandPage} from './admin/pages/brands/CreateBrandPage';
import {EditBrandPage} from './admin/pages/brands/EditBrandPage';

// eslint-disable-next-line react-refresh/only-export-components
const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'));
// eslint-disable-next-line react-refresh/only-export-components
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));

export const appRouter = createBrowserRouter([
	// Public shop routes
	{
		path: '/',
		element: <ShopLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: 'store',
				element: <StorePage />,
			},
			{
				path: 'product/:slug',
				element: <ProductPage />,
			},
			{
				path: 'about',
				element: <AboutPage />,
			},
		],
	},

	// Auth Routes
	{
		path: '/auth',
		element: (
			<NotAuthenticatedRoute>
				<AuthLayout />
			</NotAuthenticatedRoute>
		),
		children: [
			{
				index: true,
				element: <Navigate to='/auth/login' replace />,
			},
			{
				path: 'login',
				element: <LoginPage />,
			},
		],
	},

	// Admin Routes
	{
		path: '/admin',
		element: (
			<AuthenticatedRoute>
				<AdminLayout />
			</AuthenticatedRoute>
		),
		children: [
			{
				index: true,
				element: <DashboardPage />,
			},
			{
				path: 'products',
				element: <AdminProductsPage />,
			},
			{
				path: 'products/new',
				element: <CreateProductPage />,
			},
			{
				path: 'products/:productId',
				element: <AdminProductPage />,
			},
			{
				path: 'products/:productId/variants/new',
				element: <CreateProductVariantPage />,
			},
			{
				path: 'products/:productId/variants/:variantId',
				element: <EditProductVariantPage />,
			},
			{
				path: 'categories',
				element: <AdminCategoriesPage />,
			},
			{
				path: 'categories/:id',
				element: <EditCategoryPage />,
			},
			{
				path: 'categories/new',
				element: <CreateCategoryPage />,
			},
			{
				path: 'brands',
				element: <AdminBrandsPage />,
			},
			{
				path: 'brands/:id',
				element: <EditBrandPage />,
			},
			{
				path: 'brands/new',
				element: <CreateBrandPage />,
			},
		],
	},

	// Default Route
	{
		path: '*',
		element: <Navigate to='/' replace />,
	},
]);
