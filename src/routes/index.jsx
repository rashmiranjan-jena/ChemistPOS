import React from "react";
import { Navigate } from "react-router-dom";

// Pages Component
import Chat from "../pages/Chat/Chat";

// // File Manager
import FileManager from "../pages/FileManager/index";

// // Profile
import UserProfile from "../pages/Authentication/user-profile";

// Pages Calendar
import Calendar from "../pages/Calendar/index";

//Tasks
// import TasksList from "../pages/Tasks/tasks-list";
// import TasksCreate from "../pages/Tasks/tasks-create";
// import TasksKanban from "../pages/Tasks/tasks-kanban";

// // //Projects
import ProjectsGrid from "../pages/Projects/projects-grid";
// import ProjectsList from "../pages/Projects/projects-list";
// import ProjectsOverview from "../pages/Projects/ProjectOverview/projects-overview";
// import ProjectsCreate from "../pages/Projects/projects-create";

// // //Ecommerce Pages
// import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts";
import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProductDetail/index";
// import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";
// import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";
// import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
// import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
// import EcommerceShops from "../pages/Ecommerce/EcommerceShops/index";
// import EcommerenceAddProduct from "../pages/Ecommerce/EcommerceAddProduct";

// Registartion
import RegistartionModule from "../pages/RegistrationModule/RegistartionModule";
import RegistartionModuleliist from "../pages/RegistrationModule/RegistartionModuleliist";

// Business Details
import BankInfo from "../pages/BusinessDetails/BankInfo/BankInfo";
import BankInfoList from "../pages/BusinessDetails/BankInfo/BankInfoList";
import BrandInfo from "../pages/BusinessDetails/BrandInfo/BrandInfo";
import BrandInfolist from "../pages/BusinessDetails/BrandInfo/BrandInfolist";
import BusinessInfo from "../pages/BusinessDetails/BusinessInfo/BusinessInfo";
import BusinessInfoList from "../pages/BusinessDetails/BusinessInfo/BusinessInfoList";
import StoreInfo from "../pages/BusinessDetails/StoreInfo/StoreInfo";
import StoreInfoList from "../pages/BusinessDetails/StoreInfo/StoreInfoList";
import ContactInfo from "../pages/BusinessDetails/ContactInfo/ContactInfo";
import ContactInfoList from "../pages/BusinessDetails/ContactInfo/ContactInfoList";
import SocialInfo from "../pages/BusinessDetails/SocialInfo/SocialInfo";
import SocialInfoList from "../pages/BusinessDetails/SocialInfo/SocialInfoList";
// Catalog Management
import BrandMaster from "../pages/CatelogManagement/BrandMaster/BrandMaster";
import CategoryMaster from "../pages/CatelogManagement/CategoryMaster/CategoryMaster";
import SubcategoryMaster from "../pages/CatelogManagement/Subcategory Master/SubcategoryMaster";
import VariantMaster from "../pages/CatelogManagement/VariantMaster/VariantMaster";
import WeightMaster from "../pages/CatelogManagement/WeightMaster/WeightMaster";
import CurrencyMaster from "../pages/CatelogManagement/CurrencyMaster/CurrencyMaster";
import PackUnitMaster from "../pages/CatelogManagement/PackUnitMaster/PackUnitMaster";
import ColorMaster from "../pages/CatelogManagement/ColorMaster/ColorMaster";
import SizeMaster from "../pages/CatelogManagement/SizeMaster/SizeMaster";
import ProductMaster from "../pages/CatelogManagement/ProductMaster/ProductMaster";
import BrandMasterTable from "../pages/CatelogManagement/BrandMaster/BrandMasterTable";
import CategoryMasterlist from "../pages/CatelogManagement/CategoryMaster/CategoryMasterlist";
import SubcategoryMasterlist from "../pages/CatelogManagement/Subcategory Master/SubcategoryMasterlist";
import VariantMasterlist from "../pages/CatelogManagement/VariantMaster/VariantMasterlist";
import ProductMasterlist from "../pages/CatelogManagement/ProductMaster/ProductMasterlist";
import Gstmaster from "../pages/CatelogManagement/Gstmaster/Gstmaster";
import Gstlist from "../pages/CatelogManagement/Gstmaster/Gstlist";
import ProductInventory from "../pages/CatelogManagement/ProductInventory/ProductInventory";
import ProductInventoryList from "../pages/CatelogManagement/ProductInventory/ProductInventoryList";
import CategoryNameMaster from "../pages/CatelogManagement/CategoryNameMaster/CategoryNameMaster";
import CategoryNameMasterList from "../pages/CatelogManagement/CategoryNameMaster/CategoryNameMasterList";

//  Transaction Management
import DeliveryManagement from "../pages/TransactionManagement/DeliveryManagement/DeliveryManagement";
import OrderManagement from "../pages/TransactionManagement/OrderManagement/OrderManagement";
import AgentMaster from "../pages/TransactionManagement/AgentMaster/AgentMaster";
import AgentMasterList from "../pages/TransactionManagement/AgentMaster/AgentMasterList";
// Return and Refund
import RefundDetails from "../pages/ReturnAndRefund/RefundDetails/RefundDetails";
import ReturnOrExange from "../pages/ReturnAndRefund/ReturnOrExange/ReturnOrExange";
import CancelationDetails from "../pages/ReturnAndRefund/CancelationDetails/CancelationDetails";
import PickupDetails from "../pages/ReturnAndRefund/PickupDetails/PickupDetails";
// policy
import PolicyName from "../pages/Policy/PolicyName/PolicyName";
import PolicyNameList from "../pages/Policy/PolicyName/PolicyNameList";
import PolicyMaster from "../pages/Policy/PolicyMaster/PolicyMaster";
import PolicyMasterList from "../pages/Policy/PolicyMaster/PolicyMasterList";
import CompanyPolicy from "../pages/Policy/CompanyPolicy/CompanyPolicy";
import CompanyPolicylist from "../pages/Policy/CompanyPolicy/CompanyPolicylist";
// Admin cms
import Blogs from "../pages/AdminCms/Blogs/Blogs";
import BlogsList from "../pages/AdminCms/Blogs/BlogsList";
import Career from "../pages/AdminCms/Career/Career";
import CareerList from "../pages/AdminCms/Career/CareerList";
import Blogtag from "../pages/AdminCms/Blogtag/Blogtag/Blogtag";
import Blogtaglist from "../pages/AdminCms/Blogtag/Blogtaglist/Blogtaglist";
import ContactUs from "../pages/AdminCms/ContactUs/ContactUs";
import ContactUsList from "../pages/AdminCms/ContactUs/ContactUsList";
import AboutUs from "../pages/AdminCms/AboutUs/AboutUs";
import AboutUsList from "../pages/AdminCms/AboutUs/AboutUsList";
import TestimonialsList from "../pages/AdminCms/Testimonial/TestimonialsList";
import Testimonials from "../pages/AdminCms/Testimonial/Testimonials";
// Deals and Discount
import Deals from "../pages/DealsAndDiscount/Deals/Deals";
import DiscountCode from "../pages/DealsAndDiscount/DiscountCode/DiscountCode";
import Dealslist from "../pages/DealsAndDiscount/Deals/Dealslist";
import DiscountCodelist from "../pages/DealsAndDiscount/DiscountCode/DiscountCodelist";
import DiscountApplicable from "../pages/DealsAndDiscount/DiscountApplicable/DiscountApplicable";
import DiscountApplicableList from "../pages/DealsAndDiscount/DiscountApplicable/DiscountApplicableList";
import DealsApplicablities from "../pages/DealsAndDiscount/DealsApplicablities/DealsApplicablities";
import DealsApplicablitiesList from "../pages/DealsAndDiscount/DealsApplicablities/DealsApplicablitiesList";

// Customer Management
import OrderHistory from "../pages/CustomerManagement/OrderHistory/OrderHistory";
import CartDetails from "../pages/CustomerManagement/CartDetails/CartDetails";
import CustomerWishlist from "../pages/CustomerManagement/CustomerWishlist/CustomerWishlist";
import CustomerDetails from "../pages/CustomerManagement/CustomerDetails/CustomerDetails";

//Email
// import EmailInbox from "../pages/Email/email-inbox";
// import EmailRead from "../pages/Email/email-read";
// import EmailBasicTemplte from "../pages/Email/email-basic-templte";
// import EmailAlertTemplte from "../pages/Email/email-template-alert";
// import EmailTemplateBilling from "../pages/Email/email-template-billing";

// //Invoices
import InvoicesList from "../pages/Invoices/invoices-list";
import InvoiceDetail from "../pages/Invoices/invoices-detail";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// //  // Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Login2 from "../pages/AuthenticationInner/Login2";
import Register1 from "../pages/AuthenticationInner/Register";
import Register2 from "../pages/AuthenticationInner/Register2";
import Recoverpw from "../pages/AuthenticationInner/Recoverpw";
import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import ForgetPwd2 from "../pages/AuthenticationInner/ForgetPassword2";
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";
import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";
import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";
import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";
import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2";
import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";
import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";
// import DashboardSaas from "../pages/Dashboard-saas/index";
// import DashboardCrypto from "../pages/Dashboard-crypto/index";
// import Blog from "../pages/Dashboard-Blog/index";
// import DashboardJob from "../pages/DashboardJob/index";

// //Crypto
// import CryptoWallet from "../pages/Crypto/CryptoWallet/crypto-wallet";
// import CryptoBuySell from "../pages/Crypto/crypto-buy-sell";
// import CryptoExchange from "../pages/Crypto/crypto-exchange";
// import CryptoLending from "../pages/Crypto/crypto-lending";
// import CryptoOrders from "../pages/Crypto/CryptoOrders";
// import CryptoKYCApplication from "../pages/Crypto/crypto-kyc-application";
import CryptoIcoLanding from "../pages/Crypto/CryptoIcoLanding/index";

// // Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import EChart from "../pages/Charts/EChart";
import SparklineChart from "../pages/Charts/SparklineChart";
import ChartsKnob from "../pages/Charts/charts-knob";
import ReCharts from "../pages/Charts/ReCharts";

// // Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";

// //Icons
import IconBoxicons from "../pages/Icons/IconBoxicons";
import IconDripicons from "../pages/Icons/IconDripicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
import IconFontawesome from "../pages/Icons/IconFontawesome";

// //Tables
import BasicTables from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";

// //Blog
import BlogList from "../pages/Blog/BlogList/index";
import BlogGrid from "../pages/Blog/BlogGrid/index";
import BlogDetails from "../pages/Blog/BlogDetails";

//Job
// import JobGrid from "../pages/JobPages/JobGrid/index";
// import JobDetails from "../pages/JobPages/JobDetails";
// import JobCategories from "../pages/JobPages/JobCategories";
// import JobList from "../pages/JobPages/JobList/index";
// import ApplyJobs from "../pages/JobPages/ApplyJobs/index";
// import CandidateList from "../pages/JobPages/CandidateList";
// import CandidateOverview from "../pages/JobPages/CandidateOverview";

// // Forms
// import FormElements from "../pages/Forms/FormElements";
// import FormLayouts from "../pages/Forms/FormLayouts";
// import FormAdvanced from "../pages/Forms/FormAdvanced/index";
// import FormEditors from "../pages/Forms/FormEditors";
// import FormValidations from "../pages/Forms/FormValidations";
// import FormMask from "../pages/Forms/FormMask";
// import FormRepeater from "../pages/Forms/FormRepeater";
// import FormUpload from "../pages/Forms/FormUpload";
// import FormWizard from "../pages/Forms/FormWizard";
// import DualListbox from "../pages/Tables/DualListbox";

//Ui
// import UiAlert from "../pages/Ui/UiAlerts/index";
// import UiButtons from "../pages/Ui/UiButtons/index";
// import UiCards from "../pages/Ui/UiCard/index";
// import UiCarousel from "../pages/Ui/UiCarousel";
// import UiColors from "../pages/Ui/UiColors";
// import UiDropdown from "../pages/Ui/UiDropdown/index";
// import UiOffCanvas from "../pages/Ui/UiOffCanvas";

// import UiGeneral from "../pages/Ui/UiGeneral";
// import UiGrid from "../pages/Ui/UiGrid";
// import UiImages from "../pages/Ui/UiImages";
// import UiLightbox from "../pages/Ui/UiLightbox";
// import UiModal from "../pages/Ui/UiModal/index";

// import UiTabsAccordions from "../pages/Ui/UiTabsAccordions";
// import UiTypography from "../pages/Ui/UiTypography";
// import UiVideo from "../pages/Ui/UiVideo";
// import UiSessionTimeout from "../pages/Ui/UiSessionTimeout";
// import UiRating from "../pages/Ui/UiRating";
// import UiRangeSlider from "../pages/Ui/UiRangeSlider";
// import UiNotifications from "../pages/Ui/UINotifications";

// import UiPlaceholders from "../pages/Ui/UiPlaceholders";
// import UiToasts from "../pages/Ui/UiToast";
// import UiUtilities from "../pages/Ui/UiUtilities";

// //Pages
import PagesStarter from "../pages/Utility/pages-starter";
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import PagesTimeline from "../pages/Utility/pages-timeline";
import PagesFaqs from "../pages/Utility/pages-faqs";
import PagesPricing from "../pages/Utility/pages-pricing";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";

// //Contacts
import ContactsGrid from "../pages/Contacts/contacts-grid";
import ContactsList from "../pages/Contacts/ContactList/contacts-list";
import ContactsProfile from "../pages/Contacts/ContactsProfile/index";
import UiProgressbar from "../pages/Ui/UiProgressbar";
import { components } from "react-select";
import { elements } from "chart.js";
import RattingAndFeedback from "../pages/RattingAndFeedback/RattingAndFeedback";

// Faq
import Faqcategory from "../pages/Faq/Faqcategory/Faqcategory";
import Faqcategorytable from "../pages/Faq/Faqcategory/Faqcategorytable";
import Faqmaster from "../pages/Faq/Faqmaster/Faqmaster";
import Faqmastertable from "../pages/Faq/Faqmaster/Faqmastertable";
import SupplierDetails from "../pages/PurchesManagement/SupplierDetails/SupplierDetails";
import SupplierDetailsList from "../pages/PurchesManagement/SupplierDetails/SupplierDetailsList";
import SupplierProductDetails from "../pages/PurchesManagement/SupplierProductDetails/SupplierProductDetails";
import StockInventory from "../pages/PurchesManagement/StockInventory";
import Inventory from "../pages/PurchesManagement/Inventory/Inventory";

import BulkOrder from "../pages/PurchesManagement/BulkOrder/BulkOrder";
import BulkOrderList from "../pages/PurchesManagement/BulkOrder/BulkOrderList";
import VariantName from "../pages/CatelogManagement/VariantName/VariantName";
import VariantNameList from "../pages/CatelogManagement/VariantName/VariantNameList";
// import Editbrand from "../pages/CatelogManagement/BrandMaster/Editbrand";
import TeamMember from "../pages/AdminCms/TeamMember/TeamMember";
import TeamMemberList from "../pages/AdminCms/TeamMember/TeamMemberList";
import LowStockAlert from "../pages/LowStockAlert/LowStockAlert";
import DeliveryDistribution from "../pages/TransactionManagement/DeliveryDistribution/DeliveryDistribution";
import DeliveryDistributionList from "../pages/TransactionManagement/DeliveryDistribution/DeliveryDistributionList";
import AgentWiseWork from "../pages/TransactionManagement/AgentWiseWork/AgentWiseWork";
import CustomerAllDetails from "../pages/CustomerManagement/CustomerAllDetails/CustomerAllDetails";
// import UiProgressbar from "../../src/pages/Ui/UiProgressbar"
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Editbrand from "../pages/CatelogManagement/BrandMaster/Editbrand";
import EditDeals from "../pages/DealsAndDiscount/Deals/EditDeals";
import EditDealsApplicablities from "../pages/DealsAndDiscount/DealsApplicablities/EditDealsApplicablities";
import EditBlogs from "../pages/AdminCms/Blogs/EditBlogs";
import EditProductInventory from "../pages/CatelogManagement/ProductInventory/EditProductInventory";
import EditDiscountApplicable from "../pages/DealsAndDiscount/DiscountApplicable/EditDiscountApplicable";
import TermAndCondition from "../pages/Policy/TermAndCondition/TermAndCondition";
import ListTermAndCondition from "../pages/Policy/TermAndCondition/ListTermAndCondition";

import Packagingunit from "../pages/UnitMeasurement/Packagingunit/Packagingunit";
import Measurementunit from "../pages/UnitMeasurement/Measurementunit/Measurementunit";
import Conversionunit1 from "../pages/UnitMeasurement/Conversionunit1/Conversionunit1";
import Conversionunitlist1 from "../pages/UnitMeasurement/Conversionunit1/Conversionunitlist1";
import Conversionunit2 from "../pages/UnitMeasurement/Conversionunit2/Conversionunit2";
import Conversionunitlist2 from "../pages/UnitMeasurement/Conversionunit2/Conversionunitlist2";
import Conversionunit3 from "../pages/UnitMeasurement/Conversionunit3/Conversionunit3";
import Conversionunitlist3 from "../pages/UnitMeasurement/Conversionunit3/Conversionunitlist3";
import Packagingunitlist from "../pages/UnitMeasurement/Packagingunit/Packagingunitlist";
import Measurementunitlist from "../pages/UnitMeasurement/Measurementunit/Measurementunitlist";
import ContactCart from "../pages/BusinessDetails/ContactInfo/ContactCart";
import DrugLicenceDetailsList from "../pages/DrugLicenceDetails/DrugLicenceDetailsList";
import DrugLicenceDetails from "../pages/DrugLicenceDetails/DrugLicenceDetails";
import PharmacistDocuments from "../pages/PharmacistDocuments/PharmacistDocuments";
import PharmacistDocumentsList from "../pages/PharmacistDocuments/PharmacistDocumentsList";
import CreateStoreCart from "../pages/BusinessDetails/CreateStore/CreateStoreCart";
import DepartmentCart from "../pages/BusinessDetails/Department/DepartmentCart";
import DesignationCart from "../pages/BusinessDetails/Designation/DesignationCart";
import SystemAdminDashboard from "../pages/BusinessDetails/SystemAdminDashboard/SystemAdminDashboard";
import SystemAdminReports from "../pages/BusinessDetails/SystemAdminReports/SystemAdminReports";
import AddNewEmployeeCart from "../pages/Associates/EmployeeManagement/AddNewEmployeeCart";
import AddNewEmployeeReport from "../pages/Associates/EmployeeManagement/AddNewEmployeeReport";
import AddNewEmployeeDashboard from "../pages/Associates/EmployeeManagement/AddNewEmployeeDashboard";
import DoctorManagementcart from "../pages/Associates/DoctorManagement/DoctorManagementcart";
import DoctorManagementReport from "../pages/Associates/DoctorManagement/DoctorManagementReport";
import DoctorManagementDashboard from "../pages/Associates/DoctorManagement/DoctorManagementDashboard";
import ManufacturerManagementCart from "../pages/Associates/ManufacturerManagement/ManufacturerManagementCart";
import ManufacturerManagementDashboard from "../pages/Associates/ManufacturerManagement/ManufacturerManagementDashboard";
import ManufacturerManagementReport from "../pages/Associates/ManufacturerManagement/ManufacturerManagementReport";
import SupplierManagementCart from "../pages/Associates/SupplierManagement/SupplierManagementCart";
import SupplierManagementDashboard from "../pages/Associates/SupplierManagement/SupplierManagementDashboard";
import SupplierManagementReport from "../pages/Associates/SupplierManagement/SupplierManagementReport";
import SellerManagementCart from "../pages/Associates/SellerManagement/SellerManagementCart";
import SellerManagementDashboard from "../pages/Associates/SellerManagement/SellerManagementDashboard";
import SellerManagementReport from "../pages/Associates/SellerManagement/SellerManagementReport";
import CommissionMasterCart from "../pages/Associates/CommissionMaster/CommissionMasterCart";
import CommissionMasterDashboard from "../pages/Associates/CommissionMaster/CommissionMasterDashboard";
import CommissionMasterReport from "../pages/Associates/CommissionMaster/CommissionMasterReport";
import DiscountMasterCart from "../pages/Associates/DiscountMaster/DiscountMasterCart";
import DiscountMasterDashboard from "../pages/Associates/DiscountMaster/DiscountMasterDashboard";
import DiscountMasterReport from "../pages/Associates/DiscountMaster/DiscountMasterReport";
import Associates from "../pages/Associates/Associates";
import AddNewEmployeeList from "../pages/Associates/EmployeeManagement/AddNewEmployeeList";
import DoctorManagementList from "../pages/Associates/DoctorManagement/DoctorManagementList";
import ManufacturerManagementList from "../pages/Associates/ManufacturerManagement/ManufacturerManagementList";
import SupplierManagementList from "../pages/Associates/SupplierManagement/SupplierManagementList";
import SellerManagementList from "../pages/Associates/SellerManagement/SellerManagementList";
import CommissionMasterList from "../pages/Associates/CommissionMaster/CommissionMasterList";
import DiscountMasterList from "../pages/Associates/DiscountMaster/DiscountMasterList";
import SellerTypeMasterList from "../pages/Associates/SellerTypeMaster/SellerTypeMasterList";
import AdminModule from "../pages/AdminModule/AdminModule";
// import AdminModuleList from "../pages/AdminModule/AdminModuleList";
import KycManagementList from "../pages/AdminModule/KycManagement/KycManagementList";
import DocumentMasterList from "../pages/AdminModule/DocumentMaster/DocumentMasterList";
import DrugsDashboard from "../pages/Drugs/DrugsDashboard";
import GroupCategoryList from "../pages/Drugs/GroupCategory/GroupCategoryList";
import GroupCategoryCart from "../pages/Drugs/GroupCategory/GroupCategoryCart";
import GroupDiseaseList from "../pages/Drugs/GroupDisease/GroupDiseaseList";
import GroupDiseaseCart from "../pages/Drugs/GroupDisease/GroupDiseaseCart";
import GenericDescripsationList from "../pages/Drugs/GenericDescripsation/GenericDescripsationList";
import GenericDescripsationCart from "../pages/Drugs/GenericDescripsation/GenericDescripsationCart";
import BrandList from "../pages/Drugs/Brand/BrandList";
import BrandCart from "../pages/Drugs/Brand/BrandCart";
import StrengthList from "../pages/Drugs/Strength/StrengthList";
import StrengthCart from "../pages/Drugs/Strength/StrengthCart";
import SubCategoryList from "../pages/Drugs/SubCategory/SubCategoryList";
import SubCategoryCart from "../pages/Drugs/SubCategory/SubCategoryCart";
import CategoryList from "../pages/Drugs/Category/CategoryList";
import CategoryCart from "../pages/Drugs/Category/CategoryCart";
import DiseaseCart from "../pages/Drugs/Disease/DiseaseCart";
import DiseaseList from "../pages/Drugs/Disease/DiseaseList";
import ProductTypeList from "../pages/Drugs/ProductType/ProductTypeList";
import ProductTypeCart from "../pages/Drugs/ProductType/ProductTypeCart";
import DrugFormCart from "../pages/Drugs/DrugForm/DrugFormCart";
import DrugFormList from "../pages/Drugs/DrugForm/DrugFormList";
import DrugTypeCart from "../pages/Drugs/DrugType/DrugTypeCart";
import DrugTypeList from "../pages/Drugs/DrugType/DrugTypeList";
import DrugList from "../pages/Drugs/Drug/DrugList";
import DrugCart from "../pages/Drugs/Drug/DrugCart";
import DrugsReportList from "../pages/Drugs/DrugsReport/DrugsReportList";
import GroupCategoryForm from "../pages/Drugs/GroupCategory/GroupCategoryForm";
import GroupDiseaseForm from "../pages/Drugs/GroupDisease/GroupDiseaseForm";
import GenericDescriptionForm from "../pages/Drugs/GenericDescripsation/GenericDescripsationForm";
import BrandForm from "../pages/Drugs/Brand/BrandForm";
import StrengthForm from "../pages/Drugs/Strength/StrengthForm";
import SubCategoryForm from "../pages/Drugs/SubCategory/SubCategoryForm";
import CategoryForm from "../pages/Drugs/Category/CategoryForm";
import DiseaseForm from "../pages/Drugs/Disease/DiseaseForm";
import ProductTypeForm from "../pages/Drugs/ProductType/ProductTypeForm";
import DrugForm from "../pages/Drugs/DrugForm/DrugForm";
import DrugTypeForm from "../pages/Drugs/DrugType/DrugTypeForm";
import AddDrugForm from "../pages/Drugs/Drug/AddDrugForm";
import PurchesDashboard from "../pages/Purches/PurchesDashboard";
import PurchesRequestForm from "../pages/Purches/PurchesRequest/PurchesRequestForm";
import PurchesRequestCart from "../pages/Purches/PurchesRequest/PurchesRequestCart";
import PurchesRequestList from "../pages/Purches/PurchesRequest/PurchesRequestList";
import PurchesReciptList from "../pages/Purches/PurchesRecipt/PurchesReciptList";
import PurchesReciptForm from "../pages/Purches/PurchesRecipt/PurchesReciptForm";
import PurchesReciptCart from "../pages/Purches/PurchesRecipt/PurchesReciptCart";
import PurchaseEntryList from "../pages/Purches/purchaseEntry/PurchaseEntryList";
import PurchaseEntryForm from "../pages/Purches/purchaseEntry/PurchaseEntryForm";
import PurchaseEntryCart from "../pages/Purches/purchaseEntry/PurchaseEntryCart";
import PurchesReportCart from "../pages/Purches/PurchesReport/PurchesReportCart";
import GstDashboard from "../pages/Gst/GstDashboard";
import InventoryManagement from "../pages/InventoryManagement/InventoryManagement";
import SalesWiseInventoryList from "../pages/InventoryManagement/SalesWiseInventory/SalesWiseInventoryList";
import PurchesWiseInventoryList from "../pages/InventoryManagement/PurchesWiseInventory/PurchesWiseInventoryList";
import LowStockInventoryList from "../pages/InventoryManagement/LowStockInventory/LowStockInventoryList";
import SupplierWiseInventoryList from "../pages/InventoryManagement/SupplierWiseInventory/SupplierWiseInventoryList";
import TotalInventoryList from "../pages/InventoryManagement/TotalInventory/TotalInventoryList";
import ExpireDateInventoryList from "../pages/InventoryManagement/ExpireDateInventory/ExpireDateInventoryList";
import GstMasterList from "../pages/Gst/GstMaster/GstMasterList";
import EmployeeBasicDetailsForm from "../pages/Associates/EmployeeManagement/EmployeeBasicDetailsForm";
import EmployeeCompanyDetails from "../pages/Associates/EmployeeManagement/EmployeeCompanyDetails";
import EmployeeLoginDetails from "../pages/Associates/EmployeeManagement/EmployeeLoginDetails";
import EmployeeEducationDetails from "../pages/Associates/EmployeeManagement/EmployeeEducationDetails";
import EmployeeExperienceDetails from "../pages/Associates/EmployeeManagement/EmployeeExperienceDetails";
import DoctorBasicDetails from "../pages/Associates/DoctorManagement/DoctorBasicDetails";
import DoctorActivityDetails from "../pages/Associates/DoctorManagement/DoctorActivityDetails";
import ManufacturDetailsForm from "../pages/Associates/ManufacturerManagement/ManufacturDetailsForm";
import SupplierManagementForm from "../pages/Associates/SupplierManagement/SupplierManagementForm";
import SellerManagementForm from "../pages/Associates/SellerManagement/SellerManagementForm";
import CommissionMasterForm from "../pages/Associates/CommissionMaster/CommissionMasterForm";
import DiscountMasterForm from "../pages/Associates/DiscountMaster/DiscountMasterForm";
import KycManagementCart from "../pages/AdminModule/KycManagement/KycManagementCart";
import KycManagementForm from "../pages/AdminModule/KycManagement/KycManagementForm";
import DocumentMasterForm from "../pages/AdminModule/DocumentMaster/DocumentMasterForm";
import GstMasterCart from "../pages/Gst/GstMaster/GstMasterCart";
import GstMasterForm from "../pages/Gst/GstMaster/GstMasterForm";
import TotalInventoryCart from "../pages/InventoryManagement/TotalInventory/TotalInventoryCart";
import TotalInventoryForm from "../pages/InventoryManagement/TotalInventory/TotalInventoryForm";
import ExpireDateInventoryForm from "../pages/InventoryManagement/ExpireDateInventory/ExpireDateInventoryForm";
import ExpireDateInventoryCart from "../pages/InventoryManagement/ExpireDateInventory/ExpireDateInventoryCart";
import SupplierWiseInventoryCart from "../pages/InventoryManagement/SupplierWiseInventory/SupplierWiseInventoryCart";
import SupplierWiseInventoryForm from "../pages/InventoryManagement/SupplierWiseInventory/SupplierWiseInventoryForm";
import LowStockInventoryCart from "../pages/InventoryManagement/LowStockInventory/LowStockInventoryCart";
import LowStockInventoryForm from "../pages/InventoryManagement/LowStockInventory/LowStockInventoryForm";
import PurchesWiseInventoryCart from "../pages/InventoryManagement/PurchesWiseInventory/PurchesWiseInventoryCart";
import PurchesWiseInventoryForm from "../pages/InventoryManagement/PurchesWiseInventory/PurchesWiseInventoryForm";
import SalesWiseInventoryCart from "../pages/InventoryManagement/SalesWiseInventory/SalesWiseInventoryCart";
import SalesWiseInventoryForm from "../pages/InventoryManagement/SalesWiseInventory/SalesWiseInventoryForm";
import DrugLicenceDetailsForm from "../pages/DrugLicenceDetails/DrugLicenceDetailsForm";
import BusinessRegistrationForm from "../pages/BusinessRegistration/BusinessRegistrationForm";
import BusinessRegistrationList from "../pages/BusinessRegistration/BusinessRegistrationList";
import UnitMeasurementDashboard from "../pages/UnitMeasurement/UnitMeasurementDashboard";
import CreateStoreList from "../pages/BusinessDetails/CreateStore/CreateStoreList";
import StoreDetailsForm from "../pages/BusinessDetails/CreateStore/StoreDetailsForm";
import StoreRegistrationForm from "../pages/BusinessDetails/StoreRegistration/StoreRegistrationForm";
import StoreRegistrationList from "../pages/BusinessDetails/StoreRegistration/StoreRegistrationList";
import DepartmentList from "../pages/BusinessDetails/Department/DepartmentList";
import DepartmentForm from "../pages/BusinessDetails/Department/DepartmentForm";
import DesignationList from "../pages/BusinessDetails/Designation/DesignationList";
import DesignationForm from "../pages/BusinessDetails/Designation/DesignationForm";
import PosDashboard from "../pages/Pos/PosDashboard";
import SalesBillReport from "../pages/Pos/SalesBillReport";
import DailySalesReport from "../pages/Pos/DailySalesReport";
import MedicalReportDashboard from "../pages/MedicalReport/MedicalReportDashboard";
import FinancialYearManagementDashboard from "../pages/FinancialYearManagement/FinancialYearManagementDashboard";
import AccountingManagementDashboard from "../pages/AccountingManagement/AccountingManagementDashboard";
import MedicalReportMasterList from "../pages/MedicalReport/MedicalReportMaster/MedicalReportMasterList";
import MedicalReportMasterForm from "../pages/MedicalReport/MedicalReportMaster/MedicalReportMasterForm";
import MrSalesReportList from "../pages/MedicalReport/MrSalesReport/MrSalesReportlist";
import MrSalesReportForm from "../pages/MedicalReport/MrSalesReport/MrSalesReportForm";
import CommissionPaymentList from "../pages/MedicalReport/CommissionPayment/CommissionPaymentList";
import CommissionPaymentForm from "../pages/MedicalReport/CommissionPayment/CommissionPaymentForm";
import MedicalReportVisitList from "../pages/MedicalReport/MedicalReportVisit/MedicalReportVisitList";
import MedicalReportVisitForm from "../pages/MedicalReport/MedicalReportVisit/MedicalReportVisitForm";
import ReceivedAmountList from "../pages/AccountingManagement/ReceivedAmount/ReceivedAmountList";
import ReceivedAmountForm from "../pages/AccountingManagement/ReceivedAmount/ReceivedAmountForm";
import PaidAmountList from "../pages/AccountingManagement/PaidAmount/PaidAmountList";
import PaidAmountForm from "../pages/AccountingManagement/PaidAmount/PaidAmountForm";
import ReceivableList from "../pages/AccountingManagement/Receivable/ReceivableList";
import ReceivableForm from "../pages/AccountingManagement/Receivable/ReceivableForm";
import PayableForm from "../pages/AccountingManagement/Payable/PayableForm";
import PayableList from "../pages/AccountingManagement/Payable/PayableList";
import ProfitCalculationForm from "../pages/AccountingManagement/ProfitCalculation/ProfitCalculationForm";
import ProfitCalculationList from "../pages/AccountingManagement/ProfitCalculation/ProfitCalculationList";
import SalaryAndExpensesForm from "../pages/AccountingManagement/SalaryAndExpenses/SalaryForm";
import SalaryAndExpensesList from "../pages/AccountingManagement/SalaryAndExpenses/SalaryList";
import TaxManagementForm from "../pages/AccountingManagement/TaxManagement/TaxManagementForm";
import TaxManagementList from "../pages/AccountingManagement/TaxManagement/TaxManagementList";
import TaxOutputForm from "../pages/AccountingManagement/TaxOutput/TaxOutputForm";
import TaxOutputList from "../pages/AccountingManagement/TaxOutput/TaxOutputList";
import FinancialTransactionsForm from "../pages/AccountingManagement/FinancialTransactions/FinancialTransactionsForm";
import FinancialTransactionsList from "../pages/AccountingManagement/FinancialTransactions/FinancialTransactionsList";
import GrossProfitCalculationForm from "../pages/AccountingManagement/GrossProfitCalculation/GrossProfitCalculationForm";
import GrossProfitCalculationList from "../pages/AccountingManagement/GrossProfitCalculation/GrossProfitCalculationList";
import GstPayableAlertForm from "../pages/AccountingManagement/GstPayableAlert/GstPayableAlertForm";
import GstPayableAlertList from "../pages/AccountingManagement/GstPayableAlert/GstPayableAlertList";
import SalaryAndExpensesCart from "../pages/AccountingManagement/SalaryAndExpenses/SalaryAndExpensesCart";
import SalaryList from "../pages/AccountingManagement/SalaryAndExpenses/SalaryList";
import SalaryForm from "../pages/AccountingManagement/SalaryAndExpenses/SalaryForm";
import ExpenseList from "../pages/AccountingManagement/SalaryAndExpenses/ExpenseList";
import ExpenseForm from "../pages/AccountingManagement/SalaryAndExpenses/ExpenseForm";
import TaxInputList from "../pages/AccountingManagement/TaxInput/TaxInputList";
import TaxInputForm from "../pages/AccountingManagement/TaxInput/TaxInputForm";
import StoreContactDetailsForm from "../pages/BusinessDetails/StoreContactDetails/StoreContactDetailsForm";
import StoreContactDetailsList from "../pages/BusinessDetails/StoreContactDetails/StoreContactDetailsList";
import FinancialYearSetupList from "../pages/FinancialYearManagement/FinancialYearSetup/FinancialYearSetupList";
import FinancialYearSetupForm from "../pages/FinancialYearManagement/FinancialYearSetup/FinancialYearSetupForm";
import YearEndProcessList from "../pages/FinancialYearManagement/YearEndProcess/YearEndProcessList";
import FinancialYearManagementCart from "../pages/FinancialYearManagement/FinancialYearwiseReports/FinancialYearManagementCart";
import YearlySalesReport from "../pages/FinancialYearManagement/FinancialYearwiseReports/YearlySalesReport";
import YearlyPurchaseReport from "../pages/FinancialYearManagement/FinancialYearwiseReports/YearlyPurchaseReport";
import YearlyProfitLossStatement from "../pages/FinancialYearManagement/FinancialYearwiseReports/YearlyProfitLossStatement";
import YearlyStockReport from "../pages/FinancialYearManagement/FinancialYearwiseReports/YearlyStockReport";
import YearlyTaxComplianceReport from "../pages/FinancialYearManagement/FinancialYearwiseReports/YearlyTaxComplianceReport";
import YearlyCustomerCreditReport from "../pages/FinancialYearManagement/FinancialYearwiseReports/YearlyCustomerCreditReport";
import YearlyExpenseReport from "../pages/FinancialYearManagement/FinancialYearwiseReports/YearlyExpenseReport";
import DayCloseManagementDashboard from "../pages/DayCloseManagement/DayCloseManagementDashboard";
import DayCloseProcessCart from "../pages/DayCloseManagement/DayCloseProcess/DayCloseProcessCart";
import StoreDrugLicenceList from "../pages/StoreDrugLicence/StoreDrugLicenceList";
import StoreDrugLicenceForm from "../pages/StoreDrugLicence/StoreDrugLicenceForm";
import DayCloseProcessList from "../pages/DayCloseManagement/DayCloseProcess/DayCloseProcessList";
import DayCloseProcessForm from "../pages/DayCloseManagement/DayCloseProcess/DayCloseProcessForm";
import SupplierTypeMasterForm from "../pages/Associates/SupplierTypeMaster/SupplierTypeMasterForm";
import SupplierTypeMasterList from "../pages/Associates/SupplierTypeMaster/SupplierTypeMasterList";
import SellerTypeMasterForm from "../pages/Associates/SellerTypeMaster/SellerTypeMasterForm";
import ExpireProductReturn from "../pages/Return/ExpireProductReturn";
import AllTransations from "../pages/AllTransations/AllTransations";
import DrugOrderManagement from "../pages/DrugOrderManagement/DrugOrderManagement";
import CustomerTypeMasterList from "../pages/Associates/CustomerTypeMaster/CustomerTypeMasterList";
import CustomerTypeMasterForm from "../pages/Associates/CustomerTypeMaster/CustomerTypeMasterForm";
import ManufacturerTypeMasterForm from "../pages/Associates/ManufacturerTypeMaster/ManufacturerTypeMasterForm";
import ManufacturerTypeMasterList from "../pages/Associates/ManufacturerTypeMaster/ManufacturerTypeMasterList";
import PurchesRequestReport from "../pages/Purches/PurchesReport/PurchesRequestReport";
import PurchesOrderReport from "../pages/Purches/PurchesReport/PurchesOrderReport";
import GoodsReport from "../pages/Purches/PurchesReport/GoodsReport";
import PendingDeliverReport from "../pages/Purches/PurchesRecipt/PendingDeliverReport";
import InvoiceReport from "../pages/Purches/PurchesRecipt/InvoiceReport";
import AvailabilityInventory from "../pages/InventoryManagement/AvailabilityInventory/AvailabilityInventory";
import ExpireDrugsInventory from "../pages/InventoryManagement/ExpireDrugsInventory/ExpireDrugsInventory";
import AboutToExpireInventory from "../pages/InventoryManagement/AboutToExpireInventory/AboutToExpireInventory";
import PurchesWithoutPoForm from "../pages/Purches/PurchesWithoutPo/PurchesWithoutPoForm";
import GstReport from "../pages/Purches/PurchesReport/GstReport";
import PosPage from "../pages/Pos/PosPage";
import GstR1Report from "../pages/Purches/PurchesReport/GstR1Report";
import ReturnProduct from "../pages/Return/ReturnProduct";
import ReturnCart from "../pages/Return/ReturnCart";
import ReturnMemo from "../pages/Return/ReturnMemo";
import ReturnBillForm from "../pages/Return/ReturnBillForm";
import ReturnBill from "../pages/Return/ReturnBill";
import ReturnAdjusment from "../pages/Return/ReturnAdjusment";
import ReturnAdjusmentForm from "../pages/Return/ReturnAdjusmentForm";
import TdsForm from "../pages/AccountingManagement/TDS/TdsForm";
import TdsList from "../pages/AccountingManagement/TDS/TdsList";
import TcsForm from "../pages/AccountingManagement/TCS/TcsForm";
import TcsList from "../pages/AccountingManagement/TCS/TcsList";
import PurchaseReport from "../pages/AccountingManagement/PurchaseReport/PurchaseReport";
import StockInventoryReport from "../pages/AccountingManagement/StockInventoryReport/StockInventoryReport";
import ExpireManagementReport from "../pages/AccountingManagement/ExpireManagementReport/ExpireManagementReport";
import SalesReport from "../pages/AccountingManagement/SalesReport/SalesReport";
import CustomerLadger from "../pages/AccountingManagement/CustomerLadger/CustomerLadger";
import SupplierLedger from "../pages/AccountingManagement/SupplierLedger/SupplierLedger";
import DoctorwiseSalesCommissionReport from "../pages/AccountingManagement/DoctorwiseSalesCommissionReport/DoctorwiseSalesCommissionReport";
import MRwiseSalesCommissionReceivableReport from "../pages/AccountingManagement/MRwiseSalesCommissionReceivableReport/MRwiseSalesCommissionReceivableReport";
import GrossProfitReport from "../pages/AccountingManagement/GrossProfitReport/GrossProfitReport";
import ProfitLossReport from "../pages/AccountingManagement/ProfitLossReport/ProfitLossReport";
import BalanceSheet from "../pages/AccountingManagement/BalanceSheet/BalanceSheet";
import DailyCollectionReport from "../pages/AccountingManagement/DailyCollectionReport/DailyCollectionReport";
import NonMedicalProductsForm from "../pages/Drugs/NonMedicalProducts/NonMedicalProductsForm";
import NonMedicalProductsList from "../pages/Drugs/NonMedicalProducts/NonMedicalProductsList";
import StorageList from "../pages/Storage/StorageList";
import StorageForm from "../pages/Storage/StorageForm";
import MarketDemandForm from "../pages/Purches/MarketDemand/MarketDemandForm";
import MarketDemandList from "../pages/Purches/MarketDemand/MarketDemandList";
import DayCloseReport from "../pages/DayCloseManagement/DayCloseReport";
import ThreshholdList from "../pages/ThreshHold/ThreshholdList";
import ThreshholdForm from "../pages/ThreshHold/ThreshholdForm";
const authProtectedRoutes = [
  {
    path: "/store-contact-details-list",
    component: <StoreContactDetailsList />,
  },
  {
    path: "/store-contact-details-form",
    component: <StoreContactDetailsForm />,
  },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/Lowstockalert", components: <LowStockAlert /> },
  // { path: "/dashboard-saas", component: <DashboardSaas /> },
  // { path: "/dashboard-crypto", component: <DashboardCrypto /> },
  // { path: "/blog", component: <Blog /> },
  // { path: "/dashboard-job", component: <DashboardJob /> },

  //   //Crypto
  // { path: "/crypto-wallet", component: <CryptoWallet /> },
  // { path: "/crypto-buy-sell", component: <CryptoBuySell /> },
  // { path: "/crypto-exchange", component: <CryptoExchange /> },
  // { path: "/crypto-landing", component: <CryptoLending /> },
  // { path: "/crypto-orders", component: <CryptoOrders /> },
  // { path: "/crypto-kyc-application", component: <CryptoKYCApplication /> },

  //chat
  { path: "/chat", component: <Chat /> },

  //File Manager
  { path: "/apps-filemanager", component: <FileManager /> },

  // //calendar
  { path: "/calendar", component: <Calendar /> },

  //   // //profile
  { path: "/profile", component: <UserProfile /> },

  //   //Ecommerce
  {
    path: "/ecommerce-product-detail/:id",
    component: <EcommerceProductDetail />,
  },
  // { path: "/ecommerce-products", component: <EcommerceProducts /> },
  // { path: "/ecommerce-orders", component: <EcommerceOrders /> },
  // { path: "/ecommerce-customers", component: <EcommerceCustomers /> },
  // { path: "/ecommerce-cart", component: <EcommerceCart /> },
  // { path: "/ecommerce-checkout", component: <EcommerceCheckout /> },
  // { path: "/ecommerce-shops", component: <EcommerceShops /> },
  // { path: "/ecommerce-add-product", component: <EcommerenceAddProduct /> },

  // Registartion
  {
    path: "/registration",
    component: <RegistartionModule />,
  },
  {
    path: "/registrationlist",
    component: <RegistartionModuleliist />,
  },
  // Business Details
  {
    path: "/brandinfo",
    component: <BrandInfo />,
  },
  {
    path: "/create-company-cart",
    component: <ContactCart />,
  },
  {
    path: "/add-new-employee-list",
    component: <AddNewEmployeeList />,
  },
  {
    path: "/add-new-doctor-list",
    component: <DoctorManagementList />,
  },
  {
    path: "/manufacturer-management-list",
    component: <ManufacturerManagementList />,
  },
  {
    path: "/supplier-management-list",
    component: <SupplierManagementList />,
  },
  {
    path: "/seller-management-list",
    component: <SellerManagementList />,
  },
  {
    path: "/commission-master-list",
    component: <CommissionMasterList />,
  },
  {
    path: "/discount-master-list",
    component: <DiscountMasterList />,
  },
  {
    path: "/product-return",
    component: <ExpireProductReturn />,
  },
  {
    path: "/return-memo",
    component: <ReturnMemo />,
  },
  {
    path: "/return-item",
    component: <ReturnProduct />,
  },
  {
    path: "/all-transaction",
    component: <AllTransations />,
  },
  {
    path: "/drugs-order-management",
    component: <DrugOrderManagement />,
  },
  {
    path: "/supplier-type-master-form",
    component: <SupplierTypeMasterForm />,
  },
  {
    path: "/supplier-type-master-list",
    component: <SupplierTypeMasterList />,
  },
  {
    path: "/seller-type-master-form",
    component: <SellerTypeMasterForm />,
  },
  {
    path: "/seller-master-list",
    component: <SellerTypeMasterList />,
  },
  {
    path: "/create-store-cart",
    component: <CreateStoreCart />,
  },
  {
    path: "/store-details-list",
    component: <CreateStoreList />,
  },
  {
    path: "/create-store-form",
    component: <StoreDetailsForm />,
  },
  {
    path: "/drug-licence-details-list",
    component: <DrugLicenceDetailsList />,
  },
  {
    path: "/store-registration-form",
    component: <StoreRegistrationForm />,
  },
  {
    path: "/store-registration-list",
    component: <StoreRegistrationList />,
  },
  {
    path: "/store-drug-licence-list",
    component: <StoreDrugLicenceList />,
  },
  {
    path: "/store-drug-licence-form",
    component: <StoreDrugLicenceForm />,
  },
  {
    path: "/drug-licence-form",
    component: <DrugLicenceDetailsForm />,
  },
  {
    path: "/pharmacist-documents",
    component: <PharmacistDocuments />,
  },
  {
    path: "/pharmacist-documents-list",
    component: <PharmacistDocumentsList />,
  },
  {
    path: "/create-department-cart",
    component: <DepartmentCart />,
  },
  {
    path: "/department-list",
    component: <DepartmentList />,
  },
  {
    path: "/department-form",
    component: <DepartmentForm />,
  },
  {
    path: "/create-designation-cart",
    component: <DesignationCart />,
  },
  {
    path: "/designation-list",
    component: <DesignationList />,
  },
  {
    path: "/designation-form",
    component: <DesignationForm />,
  },
  {
    path: "/system-admin-reports",
    component: <SystemAdminReports />,
  },
  {
    path: "/system-admin-dashboard",
    component: <SystemAdminDashboard />,
  },
  {
    path: "/create-store-list",
    component: <CreateStoreList />,
  },
  {
    path: "/brandinfolist",
    component: <BrandInfolist />,
  },
  {
    path: "/businessinfo",
    component: <BusinessInfo />,
  },
  {
    path: "/businessinfolist",
    component: <BusinessInfoList />,
  },
  {
    path: "/bankinfo",
    component: <BankInfo />,
  },
  {
    path: "/bankinfolist",
    component: <BankInfoList />,
  },
  {
    path: "/socialinfo",
    component: <SocialInfo />,
  },
  {
    path: "/socialinfolist",
    component: <SocialInfoList />,
  },
  {
    path: "/contactinfo",
    component: <ContactInfo />,
  },
  {
    path: "/contact-details-list",
    component: <ContactInfoList />,
  },
  {
    path: "/storeinfo",
    component: <StoreInfo />,
  },
  {
    path: "/storeinfolist",
    component: <StoreInfoList />,
  },

  // system admin business registartion
  {
    path: "/business-registration-form",
    component: <BusinessRegistrationForm />,
  },
  {
    path: "/business-registration-list",
    component: <BusinessRegistrationList />,
  },

  // Associate

  {
    path: "/associate",
    component: <Associates />,
  },
  // newemployee
  {
    path: "/add-new-employee-cart",
    component: <AddNewEmployeeCart />,
  },
  {
    path: "/customer-type-master-list",
    component: <CustomerTypeMasterList />,
  },
  {
    path: "/customer-type-master-form",
    component: <CustomerTypeMasterForm />,
  },
  {
    path: "/employee-basic-details",
    component: <EmployeeBasicDetailsForm />,
  },
  {
    path: "/employee-company-details",
    component: <EmployeeCompanyDetails />,
  },
  {
    path: "/employee-login-details",
    component: <EmployeeLoginDetails />,
  },
  {
    path: "/employee-education-details",
    component: <EmployeeEducationDetails />,
  },

  {
    path: "/employee-experience-details",
    component: <EmployeeExperienceDetails />,
  },
  {
    path: "/newemployee-reports",
    component: <AddNewEmployeeReport />,
  },
  {
    path: "/newemployee-dashboard",
    component: <AddNewEmployeeDashboard />,
  },
  // Doctor
  {
    path: "/add-new-doctor-cart",
    component: <DoctorManagementcart />,
  },
  {
    path: "/doctor-reports",
    component: <DoctorManagementReport />,
  },
  {
    path: "/doctor-dashboard",
    component: <DoctorManagementDashboard />,
  },
  {
    path: "/doctor-basic-details",
    component: <DoctorBasicDetails />,
  },
  {
    path: "/doctor-activity-details",
    component: <DoctorActivityDetails />,
  },
  // manufacturer
  {
    path: "/add-new-manufacturer-cart",
    component: <ManufacturerManagementCart />,
  },
  {
    path: "/manufacturer-details-form",
    component: <ManufacturDetailsForm />,
  },

  {
    path: "/manufacturer-dashboard",
    component: <ManufacturerManagementDashboard />,
  },
  {
    path: "/manufacturer-reports",
    component: <ManufacturerManagementReport />,
  },
  // Supplier
  {
    path: "/add-new-supplier-cart",
    component: <SupplierManagementCart />,
  },
  {
    path: "/supplier-dashboard",
    component: <SupplierManagementDashboard />,
  },
  {
    path: "/supplier-reports",
    component: <SupplierManagementReport />,
  },
  {
    path: "/supplier-management-reports",
    component: <SupplierManagementForm />,
  },

  {
    path: "/manufacturer-type-form",
    component: <ManufacturerTypeMasterForm />,
  },
  {
    path: "/manufacturer-type-list",
    component: <ManufacturerTypeMasterList />,
  },
  // Seller
  {
    path: "/add-new-seller",
    component: <SellerManagementCart />,
  },
  {
    path: "/seller-dashboard",
    component: <SellerManagementDashboard />,
  },
  {
    path: "/seller-reports",
    component: <SellerManagementReport />,
  },
  {
    path: "/seller-management-form",
    component: <SellerManagementForm />,
  },

  // commision
  {
    path: "/add-new-commission",
    component: <CommissionMasterCart />,
  },
  {
    path: "/commission-dashboard",
    component: <CommissionMasterDashboard />,
  },
  {
    path: "/commission-reports",
    component: <CommissionMasterReport />,
  },
  {
    path: "/commision-form",
    component: <CommissionMasterForm />,
  },

  // POS

  {
    path: "/pos-reports",
    component: <PosDashboard />,
  },
  {
    path: "/sales-bill-report",
    component: <SalesBillReport />,
  },
  {
    path: "/daily-sales-report",
    component: <DailySalesReport />,
  },
  {
    path: "/medical-report-dashboard",
    component: <MedicalReportDashboard />,
  },
  {
    path: "/medical-report-list",
    component: <MedicalReportMasterList />,
  },
  {
    path: "/medical-report-form",
    component: <MedicalReportMasterForm />,
  },
  {
    path: "/medical-sales-report-list",
    component: <MrSalesReportList />,
  },
  {
    path: "/medical-sales-report-form",
    component: <MrSalesReportForm />,
  },
  {
    path: "/commission-payment-list",
    component: <CommissionPaymentList />,
  },
  {
    path: "/medical-report-visit-list",
    component: <MedicalReportVisitList />,
  },
  {
    path: "/medical-report-visit-form",
    component: <MedicalReportVisitForm />,
  },
  {
    path: "/commission-payment-form",
    component: <CommissionPaymentForm />,
  },
  {
    path: "/financial-year-management-dashboard",
    component: <FinancialYearManagementDashboard />,
  },
  {
    path: "/financial-year-setup-list",
    component: <FinancialYearSetupList />,
  },
  {
    path: "/year-end-process-list",
    component: <YearEndProcessList />,
  },
  {
    path: "/financial-year-setup-form",
    component: <FinancialYearSetupForm />,
  },
  {
    path: "/financial-yearwise-reports-cart",
    component: <FinancialYearManagementCart />,
  },
  {
    path: "/yearly-sales-report",
    component: <YearlySalesReport />,
  },
  {
    path: "/yearly-purchase-report",
    component: <YearlyPurchaseReport />,
  },
  {
    path: "/yearly-profit-loss-statement",
    component: <YearlyProfitLossStatement />,
  },
  {
    path: "/yearly-stock-report",
    component: <YearlyStockReport />,
  },
  {
    path: "//yearly-customer-credit-report",
    component: <YearlyCustomerCreditReport />,
  },
  {
    path: "/yearly-tax-compliance-report",
    component: <YearlyTaxComplianceReport />,
  },
  {
    path: "/yearly-expense-report",
    component: <YearlyExpenseReport />,
  },
  {
    path: "/day-close-management-dashboard",
    component: <DayCloseManagementDashboard />,
  },
  {
    path: "/day-close-reports",
    component: <DayCloseReport />,
  },
  {
    path: "/day-close-management-cart",
    component: <DayCloseProcessCart />,
  },
  {
    path: "/day-close-process-list",
    component: <DayCloseProcessList />,
  },
  {
    path: "/day-close-process-form",
    component: <DayCloseProcessForm />,
  },

  {
    path: "/accounting-management-dashboard",
    component: <AccountingManagementDashboard />,
  },
  {
    path: "/tds-form",
    component: <TdsForm />,
  },
  {
    path: "/tds-list",
    component: <TdsList />,
  },
  {
    path: "/tcs-form",
    component: <TcsForm />,
  },
  {
    path: "/tcs-list",
    component: <TcsList />,
  },
  {
    path: "/purchase-report",
    component: <PurchaseReport />,
  },
  {
    path: "/stock-inventory-report",
    component: <StockInventoryReport />,
  },
  {
    path: "/expire-management-report",
    component: <ExpireManagementReport />,
  },
  {
    path: "/sales-report",
    component: <SalesReport />,
  },
  {
    path: "/customer-ledger",
    component: <CustomerLadger />,
  },
  {
    path: "/supplier-ledger",
    component: <SupplierLedger />,
  },
  {
    path: "/doctor-sales-commission",
    component: <DoctorwiseSalesCommissionReport />,
  },
  {
    path: "/mr-sales-commission",
    component: <MRwiseSalesCommissionReceivableReport />,
  },
  {
    path: "/gross-profit-report",
    component: <GrossProfitReport />,
  },
  {
    path: "/profit-loss-report",
    component: <ProfitLossReport />,
  },
  {
    path: "/balance-sheet",
    component: <BalanceSheet />,
  },
  {
    path: "/daily-collection-report",
    component: <DailyCollectionReport />,
  },
  {
    path: "/received-amount-list",
    component: <ReceivedAmountList />,
  },
  {
    path: "/received-amount-form",
    component: <ReceivedAmountForm />,
  },
  {
    path: "/paid-amount-list",
    component: <PaidAmountList />,
  },
  {
    path: "/paid-amount-form",
    component: <PaidAmountForm />,
  },
  {
    path: "/receivables-list",
    component: <ReceivableList />,
  },
  {
    path: "/receivables-form",
    component: <ReceivableForm />,
  },
  {
    path: "/payables-form",
    component: <PayableForm />,
  },
  {
    path: "/payables-list",
    component: <PayableList />,
  },
  {
    path: "/profit-calculation-form",
    component: <ProfitCalculationForm />,
  },
  {
    path: "/profit-calculation-list",
    component: <ProfitCalculationList />,
  },
  {
    path: "/salary-form",
    component: <SalaryForm />,
  },
  {
    path: "/salary-list",
    component: <SalaryList />,
  },
  {
    path: "/expense-list",
    component: <ExpenseList />,
  },
  {
    path: "/expense-form",
    component: <ExpenseForm />,
  },
  {
    path: "/salary-and-expenses-cart",
    component: <SalaryAndExpensesCart />,
  },
  {
    path: "/tax-management-form",
    component: <TaxManagementForm />,
  },
  {
    path: "/tax-management-list",
    component: <TaxManagementList />,
  },
  {
    path: "/tax-input-list",
    component: <TaxInputList />,
  },
  {
    path: "/tax-input-form",
    component: <TaxInputForm />,
  },
  {
    path: "/tax-output-form",
    component: <TaxOutputForm />,
  },
  {
    path: "/tax-output-list",
    component: <TaxOutputList />,
  },
  {
    path: "/financial-transactions-form",
    component: <FinancialTransactionsForm />,
  },
  {
    path: "/financial-transactions-list",
    component: <FinancialTransactionsList />,
  },
  {
    path: "/gross-profit-calculation-form",
    component: <GrossProfitCalculationForm />,
  },
  {
    path: "/gross-profit-calculation-list ",
    component: <GrossProfitCalculationList />,
  },
  {
    path: "/gst-payable-alert-form ",
    component: <GstPayableAlertForm />,
  },
  {
    path: "/gst-payable-alert-list ",
    component: <GstPayableAlertList />,
  },
  // Admin
  {
    path: "/admin",
    component: <AdminModule />,
  },
  {
    path: "/document-master-list",
    component: <DocumentMasterList />,
  },
  {
    path: "/document-master-form",
    component: <DocumentMasterForm />,
  },
  {
    path: "/kyc-management-list",
    component: <KycManagementList />,
  },
  {
    path: "/kyc-management-cart",
    component: <KycManagementCart />,
  },
  {
    path: "/kyc-management-form",
    component: <KycManagementForm />,
  },

  // Threshhold

  {
    path: "/threshold-list",
    component: <ThreshholdList />,
  },
  {
    path: "/threshold-form",
    component: <ThreshholdForm />,
  },

  // Drugs
  {
    path: "/drugs",
    component: <DrugsDashboard />,
  },

  {
    path: "/group-category-list",
    component: <GroupCategoryList />,
  },
  {
    path: "/group-category-cart",
    component: <GroupCategoryCart />,
  },
  {
    path: "/group-category-form",
    component: <GroupCategoryForm />,
  },
  {
    path: "/group-disease-list",
    component: <GroupDiseaseList />,
  },
  {
    path: "/group-disease-cart",
    component: <GroupDiseaseCart />,
  },
  {
    path: "/group-disease-form",
    component: <GroupDiseaseForm />,
  },
  {
    path: "/generic-descripsation-list",
    component: <GenericDescripsationList />,
  },
  {
    path: "/generic-descripsation-cart",
    component: <GenericDescripsationCart />,
  },
  {
    path: "/generic-descripsation-form",
    component: <GenericDescriptionForm />,
  },
  {
    path: "/brand-list",
    component: <BrandList />,
  },
  {
    path: "/brand-cart",
    component: <BrandCart />,
  },
  {
    path: "/brand-form",
    component: <BrandForm />,
  },

  {
    path: "/strength-cart",
    component: <StrengthCart />,
  },
  {
    path: "/strength-list",
    component: <StrengthList />,
  },
  {
    path: "/strength-form",
    component: <StrengthForm />,
  },
  {
    path: "/sub-category-cart",
    component: <SubCategoryCart />,
  },
  {
    path: "/sub-category-list",
    component: <SubCategoryList />,
  },
  {
    path: "/sub-category-form",
    component: <SubCategoryForm />,
  },
  {
    path: "/category-list",
    component: <CategoryList />,
  },
  {
    path: "/category-cart",
    component: <CategoryCart />,
  },
  {
    path: "/category-form",
    component: <CategoryForm />,
  },

  {
    path: "/disease-cart",
    component: <DiseaseCart />,
  },
  {
    path: "/disease-list",
    component: <DiseaseList />,
  },
  {
    path: "/disease-form",
    component: <DiseaseForm />,
  },
  {
    path: "/product-type-cart",
    component: <ProductTypeCart />,
  },
  {
    path: "/product-type-list",
    component: <ProductTypeList />,
  },
  {
    path: "/product-type-form",
    component: <ProductTypeForm />,
  },
  {
    path: "/drug-form-cart",
    component: <DrugFormCart />,
  },
  {
    path: "/drug-form-list",
    component: <DrugFormList />,
  },
  {
    path: "/drug-form",
    component: <DrugForm />,
  },
  {
    path: "/drug-type-list",
    component: <DrugTypeList />,
  },
  {
    path: "/drug-type-cart",
    component: <DrugTypeCart />,
  },
  {
    path: "/drug-type-form",
    component: <DrugTypeForm />,
  },
  {
    path: "/drug-list",
    component: <DrugList />,
  },
  {
    path: "/drug-cart",
    component: <DrugCart />,
  },
  {
    path: "/add-drug-form",
    component: <AddDrugForm />,
  },
  {
    path: "/drug-report-list",
    component: <DrugsReportList />,
  },

  {
    path: "/storage-list",
    component: <StorageList />,
  },
  {
    path: "/storage-form",
    component: <StorageForm />,
  },
  // Purches
  {
    path: "/market-demand-form",
    component: <MarketDemandForm />,
  },
  {
    path: "/market-demand-list",
    component: <MarketDemandList />,
  },
  {
    path: "/purchase",
    component: <PurchesDashboard />,
  },
  {
    path: "/purchase-request-form",
    component: <PurchesRequestForm />,
  },
  {
    path: "/purches-request-cart",
    component: <PurchesRequestCart />,
  },
  {
    path: "/purchase-request-list",
    component: <PurchesRequestList />,
  },
  {
    path: "/purchase-receipt-list",
    component: <PurchesReciptList />,
  },
  {
    path: "/purchase-without-po-form",
    component: <PurchesWithoutPoForm />,
  },
  {
    path: "/purchase-receipt-form",
    component: <PurchesReciptForm />,
  },
  {
    path: "/purchase-receipt-cart",
    component: <PurchesReciptCart />,
  },
  {
    path: "/purchase-entry-list",
    component: <PurchaseEntryList />,
  },
  {
    path: "/purchase-entry-cart",
    component: <PurchaseEntryCart />,
  },
  {
    path: "/purchase-entry-form",
    component: <PurchaseEntryForm />,
  },
  {
    path: "/purchase-report-cart",
    component: <PurchesReportCart />,
  },
  {
    path: "/gst-report",
    component: <GstReport />,
  },

  {
    path: "/purchase-request-report",
    component: <PurchesRequestReport />,
  },
  {
    path: "/purchase-order-report",
    component: <PurchesOrderReport />,
  },
  {
    path: "/goods-received-report",
    component: <GoodsReport />,
  },
  {
    path: "/pending-deliveries-report",
    component: <PendingDeliverReport />,
  },
  {
    path: "/invoice-report",
    component: <InvoiceReport />,
  },
  // Gst
  {
    path: "/gst",
    component: <GstDashboard />,
  },
  {
    path: "/gstr1report",
    component: <GstR1Report />,
  },
  {
    path: "/gst-master-list",
    component: <GstMasterList />,
  },
  {
    path: "/gst-master-cart",
    component: <GstMasterCart />,
  },
  {
    path: "/gst-form",
    component: <GstMasterForm />,
  },
  {
    path: "/gst-report-cart",
    component: <PurchesReportCart />,
  },

  {
    path: "/purches-form",
    component: <PurchesReportCart />,
  },
  // Inventory Management
  {
    path: "/inventorymanagement",
    component: <InventoryManagement />,
  },
  {
    path: "/sales-wise-inventory",
    component: <SalesWiseInventoryList />,
  },
  {
    path: "/sales-wise-inventory-cart",
    component: <SalesWiseInventoryCart />,
  },
  {
    path: "/sales-wise-inventory-form",
    component: <SalesWiseInventoryForm />,
  },
  {
    path: "/purchase-inventory",
    component: <PurchesWiseInventoryList />,
  },
  {
    path: "/purchase-wise-inventory-cart",
    component: <PurchesWiseInventoryCart />,
  },
  {
    path: "/purchase-wise-inventory-form",
    component: <PurchesWiseInventoryForm />,
  },
  {
    path: "/low-stock-inventory",
    component: <LowStockInventoryList />,
  },
  {
    path: "/low-stock-inventory-cart",
    component: <LowStockInventoryCart />,
  },
  {
    path: "/low-stock-inventory-form",
    component: <LowStockInventoryForm />,
  },
  {
    path: "/supplier-wise-inventory",
    component: <SupplierWiseInventoryList />,
  },
  {
    path: "/supplier-wise-inventory-cart",
    component: <SupplierWiseInventoryCart />,
  },
  {
    path: "/supplier-wise-inventory-details/:id",
    component: <SupplierWiseInventoryForm />,
  },
  {
    path: "/expired-date-inventory",
    component: <ExpireDateInventoryList />,
  },
  {
    path: "/return",
    component: <ReturnCart />,
  },
  {
    path: "/return-bill-form",
    component: <ReturnBillForm />,
  },
  {
    path: "/return-bill",
    component: <ReturnBill />,
  },
  {
    path: "/return-adjustment",
    component: <ReturnAdjusment />,
  },
  {
    path: "/return-adjusment-form",
    component: <ReturnAdjusmentForm />,
  },
  {
    path: "/expire-date-inventory-form",
    component: <ExpireDateInventoryForm />,
  },
  {
    path: "/expired-date-inventory-cart",
    component: <ExpireDateInventoryCart />,
  },
  {
    path: "/total-inventory",
    component: <TotalInventoryList />,
  },
  {
    path: "/total-inventory-cart",
    component: <TotalInventoryCart />,
  },
  {
    path: "/total-inventory-form",
    component: <TotalInventoryForm />,
  },
  {
    path: "/availability-inventory",
    component: <AvailabilityInventory />,
  },
  {
    path: "/expired-drugs-inventory",
    component: <ExpireDrugsInventory />,
  },
  {
    path: "/about-to-expire-inventory",
    component: <AboutToExpireInventory />,
  },
  // Discount
  {
    path: "/add-new-discount",
    component: <DiscountMasterCart />,
  },
  {
    path: "/discount-dashboard",
    component: <DiscountMasterDashboard />,
  },
  {
    path: "/discount-reports",
    component: <DiscountMasterReport />,
  },
  {
    path: "/discount-form",
    component: <DiscountMasterForm />,
  },
  // Catalog Management
  {
    path: "/brandmaster",
    component: <BrandMaster />,
  },
  {
    path: "/brandmastertable",
    component: <BrandMasterTable />,
  },
  {
    path: "/editbrand/:id",
    component: <Editbrand />,
  },
  {
    path: "/categorynamemasterlist",
    component: <CategoryNameMasterList />,
  },

  {
    path: "/categorynamemaster",
    component: <CategoryNameMaster />,
  },
  {
    path: "/categorymasterlist",
    component: <CategoryMasterlist />,
  },

  {
    path: "/categorymaster",
    component: <CategoryMaster />,
  },
  {
    path: "/subcategorymaster",
    component: <SubcategoryMaster />,
  },
  {
    path: "/subcategorymasterlist",
    component: <SubcategoryMasterlist />,
  },
  {
    path: "/variantmaster",
    component: <VariantMaster />,
  },
  {
    path: "/variantmasterlist",
    component: <VariantMasterlist />,
  },
  {
    path: "/variantname",
    component: <VariantName />,
  },
  {
    path: "/variantnamelist",
    component: <VariantNameList />,
  },
  {
    path: "/weightmaster",
    component: <WeightMaster />,
  },
  {
    path: "/currencymaster",
    component: <CurrencyMaster />,
  },
  {
    path: "/packunitmaster",
    component: <PackUnitMaster />,
  },
  {
    path: "/colormaster",
    component: <ColorMaster />,
  },
  {
    path: "/sizemaster",
    component: <SizeMaster />,
  },
  {
    path: "/productmaster",
    component: <ProductMaster />,
  },
  {
    path: "/productmasterlist",
    component: <ProductMasterlist />,
  },
  {
    path: "/gstmaster",
    component: <Gstmaster />,
  },
  {
    path: "/gstlist",
    component: <Gstlist />,
  },
  {
    path: "/productinventory",
    component: <ProductInventory />,
  },
  {
    path: "/editproductinventory/:id",
    component: <EditProductInventory />,
  },
  {
    path: "/productinventorylist",
    component: <ProductInventoryList />,
  },

  // Unit measurement
  {
    path: "/unitandmeasurementdashboard",
    component: <UnitMeasurementDashboard />,
  },
  {
    path: "/conversionunit1",
    component: <Conversionunit1 />,
  },
  {
    path: "/conversionunitlist1",
    component: <Conversionunitlist1 />,
  },
  {
    path: "/conversionunit2",
    component: <Conversionunit2 />,
  },
  {
    path: "/conversionunitlist2",
    component: <Conversionunitlist2 />,
  },
  {
    path: "/conversionunit3",
    component: <Conversionunit3 />,
  },
  {
    path: "/conversionunitlist3",
    component: <Conversionunitlist3 />,
  },
  {
    path: "/packagingunit",
    component: <Packagingunit />,
  },
  {
    path: "/packagingunitlist",
    component: <Packagingunitlist />,
  },
  {
    path: "/measurementunit",
    component: <Measurementunit />,
  },
  {
    path: "/measurementunitlist",
    component: <Measurementunitlist />,
  },
  // TransationManagement
  {
    path: "/deliverymanagement",
    component: <DeliveryManagement />,
  },
  {
    path: "/ordermanagement",
    component: <OrderManagement />,
  },
  {
    path: "/agentmaster",
    component: <AgentMaster />,
  },
  {
    path: "/agentlist",
    component: <AgentMasterList />,
  },
  {
    path: "/agentwisework",
    component: <AgentWiseWork />,
  },
  {
    path: "/deliverydistribution",
    component: <DeliveryDistribution />,
  },
  {
    path: "/deliverydistributionlist",
    component: <DeliveryDistributionList />,
  },

  // Purchase Management
  {
    path: "/supplierdetails",
    component: <SupplierDetails />,
  },
  {
    path: "/supplierdetailslist",
    component: <SupplierDetailsList />,
  },
  {
    path: "/supplierproductdetailslist",
    component: <SupplierProductDetails />,
  },
  {
    path: "/bulkorder",
    component: <BulkOrder />,
  },
  {
    path: "/bulkorderlist",
    component: <BulkOrderList />,
  },
  {
    path: "/stockinventory",
    component: <StockInventory />,
  },
  {
    path: "/inventory",
    component: <Inventory />,
  },

  // Return and Refund
  {
    path: "/refunddetails",
    component: <RefundDetails />,
  },
  {
    path: "/returnorexchange",
    component: <ReturnOrExange />,
  },
  {
    path: "/cancelationdetails",
    component: <CancelationDetails />,
  },
  {
    path: "/pickupdetails",
    component: <PickupDetails />,
  },
  // Policy
  {
    path: "/policyname",
    component: <PolicyName />,
  },
  {
    path: "/policynamelist",
    component: <PolicyNameList />,
  },
  {
    path: "/policymaster",
    component: <PolicyMaster />,
  },
  {
    path: "/policymasterlist",
    component: <PolicyMasterList />,
  },
  {
    path: "/companypolicylist",
    component: <CompanyPolicylist />,
  },
  {
    path: "/companypolicy",
    component: <CompanyPolicy />,
  },
  {
    path: "/termandcondition",
    component: <TermAndCondition />,
  },
  {
    path: "/termandconditionlist",
    component: <ListTermAndCondition />,
  },
  // Admin cms
  {
    path: "/blogs",
    component: <Blogs />,
  },
  {
    path: "/blogslist",
    component: <BlogsList />,
  },
  {
    path: "/editblogs/:id",
    component: <EditBlogs />,
  },

  {
    path: "/career",
    component: <Career />,
  },
  {
    path: "/careerlist",
    component: <CareerList />,
  },

  {
    path: "/contactus",
    component: <ContactUs />,
  },
  {
    path: "/contactuslist",
    component: <ContactUsList />,
  },

  {
    path: "/blogtag",
    component: <Blogtag />,
  },
  {
    path: "/blogtaglist",
    component: <Blogtaglist />,
  },
  {
    path: "/admincms/aboutus",
    component: <AboutUs />,
  },
  {
    path: "/admincms/aboutuslist",
    component: <AboutUsList />,
  },
  {
    path: "/admincms/testimonial",
    component: <Testimonials />,
  },
  {
    path: "/admincms/testimoniallist",
    component: <TestimonialsList />,
  },
  {
    path: "/admincms/teammember",
    component: <TeamMember />,
  },
  {
    path: "/admincms/teammemberlist",
    component: <TeamMemberList />,
  },
  //Deals And Discount
  {
    path: "/deals",
    component: <Deals />,
  },
  {
    path: "/dealslist",
    component: <Dealslist />,
  },
  {
    path: "/editdeals/:id",
    component: <EditDeals />,
  },
  {
    path: "/discountcodes",
    component: <DiscountCode />,
  },
  {
    path: "/discountcodeslist",
    component: <DiscountCodelist />,
  },
  {
    path: "/editdiscountapplicable/:id",
    component: <EditDiscountApplicable />,
  },
  {
    path: "/discountapplicablelist",
    component: <DiscountApplicableList />,
  },
  {
    path: "/discountapplicable",
    component: <DiscountApplicable />,
  },
  {
    path: "/editdealsapplicabilities/:id",
    component: <EditDealsApplicablities />,
  },
  {
    path: "/dealsapplicabilities",
    component: <DealsApplicablities />,
  },
  {
    path: "/dealsapplicabilitieslist",
    component: <DealsApplicablitiesList />,
  },
  // Customer Management
  {
    path: "/orderhistory",
    component: <OrderHistory />,
  },
  {
    path: "/cartdetails",
    component: <CartDetails />,
  },
  {
    path: "/customer-all-details/:id",
    component: <CustomerAllDetails />,
  },
  {
    path: "/customerwishlist",
    component: <CustomerWishlist />,
  },
  {
    path: "/customerdetails",
    component: <CustomerDetails />,
  },

  // Feedback and ratting

  {
    path: "/feedback",
    component: <RattingAndFeedback />,
  },

  //   //Email
  // { path: "/email-inbox", component: <EmailInbox /> },
  // { path: "/email-read/:id?", component: <EmailRead /> },
  // { path: "/email-template-basic", component: <EmailBasicTemplte /> },
  // { path: "/email-template-alert", component: <EmailAlertTemplte /> },
  // { path: "/email-template-billing", component: <EmailTemplateBilling /> },

  //   //Invoices
  { path: "/invoices-list", component: <InvoicesList /> },
  { path: "/invoices-detail", component: <InvoiceDetail /> },
  { path: "/invoices-detail/:id?", component: <InvoiceDetail /> },

  //   // Tasks
  // { path: "/tasks-list", component: <TasksList /> },
  // { path: "/tasks-create", component: <TasksCreate /> },
  // { path: "/tasks-kanban", component: <TasksKanban /> },

  //Projects
  { path: "/projects-grid", component: <ProjectsGrid /> },
  // { path: "/projects-list", component: <ProjectsList /> },
  // { path: "/projects-overview", component: <ProjectsOverview /> },
  // { path: "/projects-overview/:id", component: <ProjectsOverview /> },
  // { path: "/projects-create", component: <ProjectsCreate /> },

  //   //Blog
  { path: "/blog-list", component: <BlogList /> },
  { path: "/blog-grid", component: <BlogGrid /> },
  { path: "/blog-details", component: <BlogDetails /> },

  // { path: "/job-grid", component: <JobGrid /> },
  // { path: "/job-details", component: <JobDetails /> },
  // { path: "/job-categories", component: <JobCategories /> },
  // { path: "/job-list", component: <JobList /> },
  // { path: "/job-apply", component: <ApplyJobs /> },
  // { path: "/candidate-list", component: <CandidateList /> },
  // { path: "/candidate-overview", component: <CandidateOverview /> },

  // Contacts
  { path: "/contacts-grid", component: <ContactsGrid /> },
  { path: "/contacts-list", component: <ContactsList /> },
  { path: "/contacts-profile", component: <ContactsProfile /> },

  // Faq

  {
    path: "/faqcategory",
    component: <Faqcategory />,
  },
  {
    path: "/faqcategorytable",
    component: <Faqcategorytable />,
  },
  {
    path: "/faqmaster",
    component: <Faqmaster />,
  },
  {
    path: "/faqmastertable",
    component: <Faqmastertable />,
  },
  //   //Charts
  { path: "/apex-charts", component: <ChartApex /> },
  { path: "/chartjs-charts", component: <ChartjsChart /> },
  { path: "/e-charts", component: <EChart /> },
  { path: "/sparkline-charts", component: <SparklineChart /> },
  { path: "/charts-knob", component: <ChartsKnob /> },
  { path: "/re-charts", component: <ReCharts /> },

  //   // Icons
  { path: "/icons-boxicons", component: <IconBoxicons /> },
  { path: "/icons-dripicons", component: <IconDripicons /> },
  { path: "/icons-materialdesign", component: <IconMaterialdesign /> },
  { path: "/icons-fontawesome", component: <IconFontawesome /> },

  //   // Tables
  { path: "/tables-basic", component: <BasicTables /> },
  { path: "/tables-datatable", component: <DatatableTables /> },

  //   // Maps
  { path: "/maps-google", component: <MapsGoogle /> },

  //   // Forms
  // { path: "/form-elements", component: <FormElements /> },
  // { path: "/form-layouts", component: <FormLayouts /> },
  // { path: "/form-advanced", component: <FormAdvanced /> },
  // { path: "/form-editors", component: <FormEditors /> },
  // { path: "/form-mask", component: <FormMask /> },
  // { path: "/form-repeater", component: <FormRepeater /> },
  // { path: "/form-uploads", component: <FormUpload /> },
  // { path: "/form-wizard", component: <FormWizard /> },
  // { path: "/form-validation", component: <FormValidations /> },
  // { path: "/dual-listbox", component: <DualListbox /> },

  // Ui
  // { path: "/ui-alerts", component: <UiAlert /> },
  // { path: "/ui-buttons", component: <UiButtons /> },
  // { path: "/ui-cards", component: <UiCards /> },
  // { path: "/ui-carousel", component: <UiCarousel /> },
  // { path: "/ui-colors", component: <UiColors /> },
  // { path: "/ui-dropdowns", component: <UiDropdown /> },
  // { path: "/ui-offcanvas", component: <UiOffCanvas /> },
  // { path: "/ui-general", component: <UiGeneral /> },
  // { path: "/ui-grid", component: <UiGrid /> },
  // { path: "/ui-images", component: <UiImages /> },
  // { path: "/ui-lightbox", component: <UiLightbox /> },
  // { path: "/ui-modals", component: <UiModal /> },
  // { path: "/ui-progressbars", component: <UiProgressbar /> },
  // { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
  // { path: "/ui-typography", component: <UiTypography /> },
  // { path: "/ui-video", component: <UiVideo /> },
  // { path: "/ui-session-timeout", component: <UiSessionTimeout /> },
  // { path: "/ui-rating", component: <UiRating /> },
  // { path: "/ui-rangeslider", component: <UiRangeSlider /> },
  // { path: "/ui-notifications", component: <UiNotifications /> },
  // { path: "/ui-placeholders", component: <UiPlaceholders /> },
  // { path: "/ui-toasts", component: <UiToasts /> },
  // { path: "/ui-utilities", component: <UiUtilities /> },

  //   //Utility
  { path: "/pages-starter", component: <PagesStarter /> },
  { path: "/pages-timeline", component: <PagesTimeline /> },
  { path: "/pages-faqs", component: <PagesFaqs /> },
  { path: "/pages-pricing", component: <PagesPricing /> },

  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/login" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  {
    path: "/pos-screen",
    component: <PosPage />,
  },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "*", component: <ErrorPage /> },
  { path: "/pages-maintenance", component: <PagesMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },
  { path: "/crypto-ico-landing", component: <CryptoIcoLanding /> },

  //   // Authentication Inner
  { path: "/pages-login", component: <Login1 /> },
  { path: "/pages-login-2", component: <Login2 /> },
  { path: "/pages-register", component: <Register1 /> },
  { path: "/pages-register-2", component: <Register2 /> },
  { path: "/page-recoverpw", component: <Recoverpw /> },
  { path: "/page-recoverpw-2", component: <Recoverpw2 /> },
  { path: "/pages-forgot-pwd", component: <ForgetPwd1 /> },
  { path: "/pages-forgot-pwd-2", component: <ForgetPwd2 /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/auth-lock-screen-2", component: <LockScreen2 /> },
  { path: "/page-confirm-mail", component: <ConfirmMail /> },
  { path: "/page-confirm-mail-2", component: <ConfirmMail2 /> },
  { path: "/auth-email-verification", component: <EmailVerification /> },
  { path: "/auth-email-verification-2", component: <EmailVerification2 /> },
  { path: "/auth-two-step-verification", component: <TwostepVerification /> },
  {
    path: "/auth-two-step-verification-2",
    component: <TwostepVerification2 />,
  },
];

// export { authProtectedRoutes, publicRoutes };
export { authProtectedRoutes, publicRoutes };
