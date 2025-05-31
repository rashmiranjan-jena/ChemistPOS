import { cryptoOrders, wallet, productData, cryptoOrderData, icoLandingTeam, blogs, orderbookData } from "./crypto";
import { invoiceList } from "./invoices";
import { projects, projectListData, OverviewTeamMember, projectAssignedTo } from "./projects";
import { tasks, recentTasksData, AddTeamMember } from "./tasks";
import {
  inboxmails,
  starredmails,
  importantmails,
  draftmails,
  sentmails,
  trashmails,
  mailDB,
  labelsData,
  mailChatData
} from "./mails";
import {
  cartData,
  comments,
  customerData,
  discountData,
  orders,
  productsData,
  recentProducts,
  shops,
  productComments
} from "./ecommerce";
import { chats, contacts, groups, messages } from "./chat";
import { calenderDefaultCategories, events } from "./calender";
import { users, userProfile } from "./contacts";
import { dahsboardEmail, activityData, latestTransaction, TopCitiesSelling } from "./dashboard";
import { jobs, jobListCandidate, jobApply } from "./job";

import {
  TopSellingData,
  dashboardEarning,
  chatData, tasksData
} from "./dashboard-saas";

import { walletOptions, transactionsDataALL, transactionsDataBuy, transactionsDataSell, notificationsData, cryptoReports } from "./dashboard-crypto";

import { jobVacancyData, statisticsApplications, recentAddedJobsData, activityFeedData, chartsData } from "./dashboard-job";

import { visitor, blogStatsData, postRecentData, postPopularData, commentsData, progressData, activityBlogData, blogPost } from "./dashboard-blog";

import { filesData, filemanagerData, storageData } from "./file-manager";

import { categoriesData, archiveData, popularPosts, tagsData } from "./blog";

import { jobsGridData, experienceData, jobType } from "./job-Grid";

export {
  jobsGridData,
  experienceData,
  jobType,
  tagsData,
  categoriesData,
  archiveData,
  popularPosts,
  AddTeamMember,
  recentTasksData,
  mailChatData,
  labelsData,
  orderbookData,
  storageData,
  filemanagerData,
  filesData,
  activityFeedData,
  chartsData,
  recentAddedJobsData,
  activityBlogData,
  activityData,
  progressData,
  commentsData,
  postPopularData,
  postRecentData,
  notificationsData,
  cryptoReports,
  transactionsDataSell,
  transactionsDataBuy,
  transactionsDataALL,
  tasksData,
  latestTransaction,
  productsData,
  cryptoOrderData,
  discountData,
  events,
  calenderDefaultCategories,
  chats,
  groups,
  contacts,
  messages,
  orders,
  cartData,
  customerData,
  shops,
  recentProducts,
  comments,
  wallet,
  icoLandingTeam,
  inboxmails,
  importantmails,
  draftmails,
  sentmails,
  trashmails,
  starredmails,
  cryptoOrders,
  productData,
  blogs,
  invoiceList,
  projects,
  projectListData,
  TopCitiesSelling,
  OverviewTeamMember,
  projectAssignedTo,
  tasks,
  users,
  userProfile,
  dahsboardEmail,
  TopSellingData,
  dashboardEarning,
  chatData,
  productComments,
  jobs,
  jobListCandidate,
  jobApply,
  walletOptions, jobVacancyData, statisticsApplications, visitor, blogPost, blogStatsData, mailDB
};
