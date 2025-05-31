//import images
import airbnb from "../../assets/images/companies/airbnb.svg";
import mailChimp from "../../assets/images/companies/mailchimp.svg";
import reddit from "../../assets/images/companies/reddit.svg";
import amzon from "../../assets/images/companies/amazon.svg";
import adobPhotoShop from "../../assets/images/companies/adobe-photoshop.svg";
import line from "../../assets/images/companies/line.svg";
import weChat from "../../assets/images/companies/wechat.svg";
import sass from "../../assets/images/companies/sass.svg";
import adobe from "../../assets/images/companies/adobe.svg";
import flutter from "../../assets/images/companies/flutter.svg";
import spotify from "../../assets/images/companies/spotify.svg";
import avatar5 from '../../assets/images/users/avatar-5.jpg';

const jobVacancyData = [
    {
        id: 1,
        img: airbnb,
        title: "Project Manager",
        country: " California",
        vacancy: 8
    },
    {
        id: 2,
        img: mailChimp,
        title: "Marketing Director",
        country: "Danemark",
        vacancy: 12
    },
    {
        id: 3,
        img: reddit,
        title: "Product Designer",
        country: "France",
        vacancy: 25
    },
    {
        id: 4,
        img: amzon,
        title: "Magento Developer",
        country: "Hong-Kong",
        vacancy: 8
    },
    {
        id: 5,
        img: adobPhotoShop,
        title: "Product Sales Specialist",
        country: " Louisiana",
        vacancy: 1
    },
    {
        id: 6,
        img: line,
        title: "Business Associate",
        country: " Phoenix",
        vacancy: 15
    },
];

const statisticsApplications = [
    {
        id: 1,
        data: {
            company: [30, 48, 28, 74, 39, 87, 54, 36, 50, 87, 84],
            newJobs: [20, 50, 42, 10, 24, 28, 60, 35, 47, 64, 78],
            totalJobs: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
            jobView: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
        }
    },
    {
        id: 2,
        data: {
            company: [25, 95, 87, 14, 56, 12, 14, 56, 35, 14, 25],
            newJobs: [85, 87, 56, 45, 14, 87, 56, 98, 19, 51, 78, 49],
            totalJobs: [85, 75, 95, 48, 59, 68, 15, 35, 26, 45, 59, 57],
            jobView: [78, 89, 84, 98, 67, 59, 48, 42, 35, 29, 18, 59],
        }
    },
    {
        id: 3,
        data: {
            company: [30, 48, 28, 74, 39, 87, 54, 56, 35, 14, 30],
            newJobs: [52, 43, 69, 75, 49, 28, 56, 19, 51, 60, 49],
            totalJobs: [57, 49, 68, 87, 71, 29, 49, 26, 50, 59, 57],
            jobView: [78, 84, 95, 76, 68, 57, 48, 35, 29, 20, 59],
        }
    }
];
const recentAddedJobsData = [
    {
        logo: weChat,
        jobTitle: "Marketing Director",
        company: "Themesbrand, USA",
        postedTime: "53",
        postedText: "sec ago"
    },
    {
        logo: sass,
        jobTitle: "Frontend Developer",
        company: "Themesbrand, Hong-Kong",
        postedTime: "47",
        postedText: "min ago"
    },
    {
        logo: adobe,
        jobTitle: "React Developer",
        company: "Creative Agency, Danemark",
        postedTime: "1",
        postedText: "hrs ago"
    },
    {
        logo: airbnb,
        jobTitle: "NodeJs Developer",
        company: "Skote Themes, Louisiana",
        postedTime: "2",
        postedText: "hrs ago"
    },
    {
        logo: flutter,
        jobTitle: "Digital Marketing",
        company: "Web Technology pvt.Ltd, Danemark",
        postedTime: "8",
        postedText: "hrs ago"
    },
    {
        logo: mailChimp,
        jobTitle: "Marketing Director",
        company: "Skote Technology, Dominica",
        postedTime: "1",
        postedText: "days ago"
    },
    {
        logo: spotify,
        jobTitle: "Business Associate",
        company: "Themesbrand, Russia",
        postedTime: "2",
        postedText: "days ago"
    },
    {
        logo: reddit,
        jobTitle: "Backend Developer",
        company: "Adobe Agency, Malaysia",
        postedTime: "3",
        postedText: "days ago"
    }
]

const activityFeedData = [
    {
        type: "application",
        name: "Charles Brown",
        action: "applied for the job",
        jobTitle: "Sr.frontend Developer",
        timestamp: "3 min ago",
        img: avatar5,
    },
    {
        type: "subscription",
        message: "Your subscription expires today",
        actionLink: "#",
        timestamp: "53 min ago"
    },
    {
        type: "accountCreation",
        name: "Jennifer Alexandar",
        action: "created a new account as a",
        accountType: "Freelance",
        timestamp: "1 hrs ago"
    },
    {
        type: "application",
        name: "Mark Ellison",
        action: "applied for the job",
        jobTitle: "Project Manager",
        timestamp: "3 hrs ago",
        img: avatar5,
    },
    {
        type: "accountCreation",
        name: "Acolin Zelton",
        action: "created a new account as a",
        accountType: "Freelance",
        timestamp: "1 hrs ago"
    }
]

const chartsData = [
    {
        id: 1,
        title: "Job View",
        price: "14,487",
        perstangeValue: "18.89",
        badgeColor: "success",
        seriesData: [{
            name: "Job View",
            data: [36, 21, 65, 22, 35, 50, 87, 98],
        }],
        color: '["--bs-success", "--bs-transparent"]'
    },
    {
        id: 2,
        title: "New Application",
        price: "7,402",
        perstangeValue: "24.07",
        badgeColor: "success",
        seriesData: [{
            name: "New Application",
            data: [36, 48, 10, 74, 35, 50, 70, 73],
        }],
        color: '["--bs-success", "--bs-transparent"]'
    },
    {
        id: 3,
        title: "Total Approved",
        price: "12,487",
        perstangeValue: " 8.41",
        badgeColor: "success",
        seriesData: [{
            name: "Total Approved",
            data: [60, 14, 5, 60, 30, 43, 65, 84],
        }],
        color: '["--bs-success", "--bs-transparent"]'
    },
    {
        id: 4,
        title: "Total Rejected",
        price: "12,487",
        perstangeValue: " 20.63",
        badgeColor: "danger",
        istrendingArrow: true,
        seriesData: [{
            name: "Total Rejected",
            data: [32, 22, 7, 55, 20, 45, 36, 20],
        }],
        color: '["--bs-danger", "--bs-transparent"]'
    },
];

export { jobVacancyData, statisticsApplications, recentAddedJobsData, activityFeedData, chartsData };