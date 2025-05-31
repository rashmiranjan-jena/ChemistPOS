const TopSellingData = [
    {
        id: "jan",
        jan: [
            {
                name: "Product A",
                desc: "Neque quis est",
                value: 37
            },
            {
                name: "Product B",
                desc: "Quis autem iure",
                value: 72
            },
            {
                name: "Product C",
                desc: "Sed aliquam mauris.",
                value: 54
            },
        ]
    },
    {
        id: "dec",
        dec: [
            {
                name: "Product D",
                desc: "Neque quis est",
                value: 18
            },
            {
                name: "Product E",
                desc: "Quis autem iure",
                value: 51
            },
            {
                name: "Product F",
                desc: "Sed aliquam mauris.",
                value: 48
            },
        ]
    },
    {
        id: "nov",
        nov: [
            {
                name: "Product G",
                desc: "Neque quis est",
                value: 27
            },
            {
                name: "Product H",
                desc: "Quis autem iure",
                value: 75
            },
            {
                name: "Product I",
                desc: "Sed aliquam mauris.",
                value: 39
            },
        ]
    },
    {
        id: "oct",
        oct: [
            {
                name: "Product J",
                desc: "Neque quis est",
                value: 56
            },
            {
                name: "Product K",
                desc: "Quis autem iure",
                value: 41
            },
            {
                name: "Product L",
                desc: "Sed aliquam mauris.",
                value: 20
            },
        ]
    },
];


const dashboardEarning = [
    {
        id: "jan",
        jan: [31, 40, 36, 51, 49, 72, 69, 56, 68, 82, 68, 76]
    },
    {
        id: "dec",
        dec: [42, 19, 32, 51, 49, 44, 14, 56, 68, 82, 68, 60]
    },
    {
        id: "nov",
        nov: [31, 40, 30, 51, 49, 72, 69, 15, 35, 42, 18, 70]
    },
    {
        id: "oct",
        oct: [31, 40, 49, 44, 14, 56, 69, 31, 40, 36, 51, 40]
    },
]

const chatData = [
    {
        id: 1,
        name: "Steven Franklin",
        msg: "Hello!",
        time: "10.00",
        lastChat: false,
        isSender: false
    },
    {
        id: 2,
        name: "Admin",
        msg: "Hi, How are you? What about our next meeting?",
        time: "10.02",
        lastChat: false,
        isSender: true
    },
    {
        id: 3,
        name: "Steven Franklin",
        msg: "Yeah everything is fine",
        time: "10.06",
        lastChat: false,
        isSender: false
    },
    {
        id: 4,
        name: "Steven Franklin",
        msg: "& Next meeting tomorrow 10.00AM",
        time: "10.06",
        lastChat: true,
        isSender: false
    },
    {
        id: 5,
        name: "Admin",
        msg: "Wow that's great",
        time: "10.07",
        lastChat: false,
        isSender: true
    }
];

const tasksData = [
    {

        id: 1,
        task: "Skote Saas Dashboard",
        assignedTo: "Mark"
    },
    {
        id: 2,
        task: "New Landing UI",
        assignedTo: "Team A"
    },
    {
        id: 3,
        task: "Brand logo design",
        assignedTo: "Janis"
    },
    {
        id: 4,
        task: "Blog Template UI",
        assignedTo: "Dianna"
    },
    {
        id: 5,
        task: "Multipurpose Landing",
        assignedTo: "Team B"
    },
    {
        id: 6,
        task: "Redesign - Landing page",
        assignedTo: "Jerry"
    },
    {
        id: 7,
        task: "Skote Saas Dashboard",
        assignedTo: "Mark"
    }
]

export {
    TopSellingData,
    dashboardEarning,
    chatData,
    tasksData,
};