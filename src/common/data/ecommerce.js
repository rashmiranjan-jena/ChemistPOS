// IMage
import product1 from "../../assets/images/product/img-1.png";
import product2 from "../../assets/images/product/img-2.png";
import product3 from "../../assets/images/product/img-3.png";
import product4 from "../../assets/images/product/img-4.png";
import product5 from "../../assets/images/product/img-5.png";
import product6 from "../../assets/images/product/img-6.png";
import product7 from "../../assets/images/product/img-7.png";
import Pro12b from "../../assets/images/product/Pro-12b.png";
import Pro17 from "../../assets/images/product/Pro-17.png";
import Pro17a from "../../assets/images/product/Pro-17a.png";

const productsData = [
  {
    id: 1,
    image: product1,
    name: "Half sleeve T-shirt",
    link: "#",
    category: "T-shirts",
    rating: 5,
    oldPrice: 500,
    newPrice: 450,
    isOffer: true,
    offer: 0,
    reviews: 0,
    subImage: [product1, product6, product2],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "M" },
      { type: "Color", value: "Red" },
    ],

    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: product1, color: "Red" },
      { image: product2, color: "Black" },
    ],
  },
  {
    id: 2,
    image: product2,
    name: "Light blue T-shirt",
    link: "#",
    category: "T-shirts",
    rating: 4,
    oldPrice: 225,
    newPrice: 175,
    isOffer: true,
    offer: 30,
    reviews: 0,
    subImage: [product2, product5, product6],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "L" },
      { type: "Color", value: "Light blue" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: product2, color: "blue" },
      { image: product5, color: "Pink" },
    ],
  },
  {
    id: 3,
    image: product3,
    name: "Black Color T-shirt",
    link: "#",
    category: "T-shirts",
    rating: 4,
    oldPrice: 177,
    newPrice: 152,
    isOffer: true,
    offer: 10,
    reviews: 0,
    subImage: [product3, product1, product6],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "XL" },
      { type: "Color", value: "Black" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: product3, color: "Black" },
      { image: product1, color: "Red" },
    ],
  },
  {
    id: 4,
    image: product4,
    name: "Hoodie (Blue)",
    link: "#",
    category: "Hoodies",
    rating: 3,
    oldPrice: 150,
    newPrice: 145,
    reviews: 0,
    offer: 20,
    subImage: [product4, product1, Pro12b],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "M" },
      { type: "Color", value: "Blue" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: product4, color: "Light Green" },
      { image: product1, color: "Red" },
    ],
  },
  {
    id: 5,
    image: product5,
    name: "Half sleeve T-Shirt",
    link: "#",
    category: "T-shirts",
    rating: 3,
    oldPrice: 177,
    newPrice: 152,
    isOffer: true,
    offer: 40,
    reviews: 5,
    subImage: [product5, product2, product1],
    specification: [
      { type: "Size", value: "S" },
      { type: "Color", value: "Coral" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: product1, color: "Red" },
      { image: product2, color: "Blue" },
    ],
  },
  {
    id: 6,
    image: product6,
    name: "Green color T-shirt",
    link: "#",
    category: "T-shirts",
    rating: 2,
    oldPrice: 200,
    newPrice: 100,
    isOffer: true,
    offer: 30,
    reviews: 10,
    subImage: [product6, Pro17, Pro17a],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "L" },
      { type: "Color", value: "Green" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: product6, color: "Green" },
      { image: Pro17, color: "Light Green" },
    ],
  },
];

const recentProducts = [
  { id: 1, img: product7, name: "Wireless Headphone", link: "", rating: 4, oldPrice: 240, newPrice: 225, },
  { id: 2, img: product4, name: "Smiley Plain T-shirt", link: "", rating: 4, oldPrice: 150, newPrice: 145, },
  { id: 3, img: product6, name: "Sky blue color T-shirt", link: "", rating: 4, oldPrice: 138, newPrice: 135, }
];

const comments = [
  {
    id: 1,
    img: "avatar2",
    name: "Brian",
    description:
      "If several languages coalesce, the grammar of the resulting language.",
    date: "5 hrs ago",
  },
  {
    id: 2,
    img: "avatar4",
    name: "Denver",
    description:
      "To an English person, it will seem like simplified English, as a skeptical Cambridge",
    date: "07 Oct, 2019",
    childComment: [
      {
        id: 1,
        img: "avatar5",
        name: "Henry",
        description:
          "Their separate existence is a myth. For science, music, sport, etc.",
        date: "08 Oct, 2019",
      },
    ],
  },
  {
    id: 3,
    img: "Null",
    name: "Neal",
    description:
      "Everyone realizes why a new common language would be desirable.",
    date: "05 Oct, 2019",
  },
];

const discountData = [
  { label: "Less than 10%", value: 0 },
  { label: "10% or more", value: 10 },
  { label: "20% or more", value: 20 },
  { label: "30% or more", value: 30 },
  { label: "40% or more", value: 40 },
  { label: "50% or more", value: 50 },
];

const orders = [
  {
    id: "customCheck2",
    orderId: "#SK2540",
    billingName: "Neal Matthews",
    orderDate: "2019-10-08",
    total: "$400",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fa-cc-mastercard",
    paymentMethod: "Mastercard",
    coin: "Bitcoin",
    type: "Buy"
  },
  {
    id: "customCheck3",
    orderId: "#SK2541",
    billingName: "Jamal Burnett",
    orderDate: "2019-10-07",
    total: "$380",
    badgeClass: "danger",
    paymentStatus: "Chargeback",
    methodIcon: "fa-cc-visa",
    paymentMethod: "Visa",
    coin: "Ethereum",
    type: "Sell"
  },
  {
    id: "customCheck4",
    orderId: "#SK2542",
    billingName: "Juan Mitchell",
    orderDate: "2019-10-06",
    total: "$384",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fa-cc-paypal",
    paymentMethod: "Paypal",
    coin: "Bitcoin",
    type: "Buy"
  },
  {
    id: "customCheck5",
    orderId: "#SK2543",
    billingName: "Barry Dick",
    orderDate: "2019-10-05",
    total: "$412",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fa-cc-mastercard",
    paymentMethod: "Mastercard",
    coin: "litecoin",
    type: "Sell"
  },
  {
    id: "customCheck6",
    orderId: "#SK2544",
    billingName: "Ronald Taylor",
    orderDate: "2019-10-04",
    total: "$404",
    badgeClass: "warning",
    paymentStatus: "Refund",
    methodIcon: "fa-cc-visa",
    paymentMethod: "Visa",
    coin: "Bitcoin",
    type: "Buy"
  },
  {
    id: "customCheck7",
    orderId: "#SK2545",
    billingName: "Jacob Hunter",
    orderDate: "2019-10-04",
    total: "$392",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fa-cc-paypal",
    paymentMethod: "Paypal",
    coin: "Ethereum",
    type: "Sell"
  },
  {
    id: "customCheck8",
    orderId: "#SK2546",
    billingName: "William Cruz",
    orderDate: "2019-10-03",
    total: "$374",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fas fa-money-bill-alt",
    paymentMethod: "COD",
    coin: "Bitcoin",
    type: "Buy"
  },
  {
    id: "customCheck9",
    orderId: "#SK2547",
    billingName: "Dustin Moser",
    orderDate: "2019-10-02",
    total: "$350",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fa-cc-paypal",
    paymentMethod: "Mastercard",
    coin: "Bitcoin",
    type: "Sell"
  },
  {
    id: "customCheck10",
    orderId: "#SK2548",
    billingName: "Clark Benson",
    orderDate: "2019-10-01",
    total: "$345",
    badgeClass: "warning",
    paymentStatus: "Refund",
    methodIcon: "fa-cc-paypal",
    paymentMethod: "Visa",
    coin: "Ethereum",
    type: "Buy"
  },
  {
    id: "customCheck11",
    orderId: "#SK2540",
    billingName: "Neal Matthews",
    orderDate: "2019-10-08",
    total: "$400",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fa-cc-mastercard",
    paymentMethod: "Mastercard",
    coin: "Ethereum",
    type: "Sell"
  },
  {
    id: "customCheck12",
    orderId: "#SK2541",
    billingName: "Jamal Burnett",
    orderDate: "2019-10-07",
    total: "$380",
    badgeClass: "danger",
    paymentStatus: "Chargeback",
    methodIcon: "fa-cc-visa",
    paymentMethod: "Visa",
    coin: "litecoin",
    type: "Buy"
  },
  {
    id: "customCheck13",
    orderId: "#SK2542",
    billingName: "Juan Mitchell",
    orderDate: "2019-10-06",
    total: "$384",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fa-cc-paypal",
    paymentMethod: "Paypal",
    coin: "litecoin",
    type: "Sell"
  },
  {
    id: "customCheck14",
    orderId: "#SK2543",
    billingName: "Barry Dick",
    orderDate: "2019-10-05",
    total: "$412",
    badgeClass: "success",
    paymentStatus: "Paid",
    methodIcon: "fa-cc-mastercard",
    paymentMethod: "Mastercard",
    coin: "litecoin",
    type: "Buy"
  },
];

const cartData = {
  products: [
    {
      id: 1,
      img: "img1",
      name: "Half sleeve T-shirt",
      color: "Maroon",
      price: "450",
      data_attr: 2,
      total: 900,
    },
    {
      id: 2,
      img: "img2",
      name: "Light blue T-shirt",
      color: "Light blue",
      price: "225",
      data_attr: 6,
      total: 225,
    },
    {
      id: 3,
      img: "img3",
      name: "Black Color T-shirt",
      color: "Black",
      price: "152",
      data_attr: 2,
      total: 304,
    },
    {
      id: 4,
      img: "img4",
      name: "Hoodie (Blue)",
      color: "Blue",
      price: "145",
      data_attr: 2,
      total: 290,
    },
    {
      id: 5,
      img: "img5",
      name: "Half sleeve T-Shirt",
      color: "Light orange",
      price: "138",
      data_attr: 8,
      total: 138,
    },
    {
      id: 6,
      img: "img6",
      name: "Green color T-shirt",
      color: "Green",
      price: "152",
      data_attr: 2,
      total: 304,
    },
  ],
  orderSummary: {
    grandTotal: "$ 1,857",
    discount: "$ 157",
    shippingCharge: "$ 25",
    estimatedTax: "$ 19.22",
    total: "$ 1744.22",
  },
};

const customerData = [
  {
    id: 1,
    username: "Stephen Rash",
    phone: "325-250-1106",
    email: "StephenRash@teleworm.us",
    address: "2470 Grove Street Bethpage, NY 11714",
    rating: "4.2",
    walletBalance: "$5,412",
    joiningDate: "2019-10-07",
  },
  {
    id: 2,
    username: "Juan Mays",
    phone: "443-523-4726",
    email: "JuanMays@armyspy.com",
    address: "3755 Harron Drive Salisbury, MD 21875",
    rating: "4.0",
    walletBalance: "$5,632",
    joiningDate: "2019-10-06",
  },
  {
    id: 3,
    username: "Scott Henry",
    phone: "704-629-9535",
    email: "ScottHenry@jourrapide.com",
    address: "3632 Snyder Avenue Bessemer City, NC 2801",
    rating: "4.4",
    walletBalance: "$7,523",
    joiningDate: "2019-10-06",
  },
  {
    id: 4,
    username: "Cody Menendez",
    phone: "701-832-5838",
    email: "CodyMenendez@armyspy.com",
    address: "4401 Findley Avenue Minot, ND 58701",
    rating: "4.1",
    walletBalance: "$6,325",
    joiningDate: "2019-10-05",
  },
  {
    id: 5,
    username: "Jason Merino",
    phone: "706-219-4095",
    email: "JasonMerino@dayrep.com",
    address: "3159 Holly Street Cleveland, GA 30528",
    rating: "3.8",
    walletBalance: "$4,523",
    joiningDate: "2019-10-04",
  },
  {
    id: 6,
    username: "Kyle Aquino",
    phone: "415-232-5443",
    email: "KyleAquino@teleworm.us",
    address: "4861 Delaware Avenue San Francisco, CA 94143",
    rating: "4.0",
    walletBalance: "$5,412",
    joiningDate: "2019-10-03",
  },
  {
    id: 7,
    username: "David Gaul",
    phone: "314-483-4679",
    email: "DavidGaul@teleworm.us",
    address: "1207 Cottrill Lane Stlouis, MO 63101",
    rating: "4.2",
    walletBalance: "$6,180",
    joiningDate: "2019-10-02",
  },
  {
    id: 8,
    username: "John McCray",
    phone: "253-661-7551",
    email: "JohnMcCray@armyspy.com",
    address: "3309 Horizon Circle Tacoma, WA 98423",
    rating: "4.1",
    walletBalance: "$5,2870",
    joiningDate: "2019-10-02",
  },
  {
    id: 9,
    username: "Stephen Rash",
    phone: "325-250-1106",
    email: "StephenRash@teleworm.us",
    address: "2470 Grove Street Bethpage, NY 11714",
    rating: "4.2",
    walletBalance: "$5,412",
    joiningDate: "2019-10-07",
  },
  {
    id: 10,
    username: "Juan Mays",
    phone: "443-523-4726",
    email: "JuanMays@armyspy.com",
    address: "3755 Harron Drive Salisbury, MD 21875",
    rating: "4.0",
    walletBalance: "$5,632",
    joiningDate: "2019-10-06",
  },
  {
    id: 11,
    username: "Scott Henry",
    phone: "704-629-9535",
    email: "ScottHenry@jourrapide.com",
    address: "3632 Snyder Avenue Bessemer City, NC 2801",
    rating: "4.4",
    walletBalance: "$7,523",
    joiningDate: "2019-10-06",
  },
  {
    id: 12,
    username: "Cody Menendez",
    phone: "701-832-5838",
    email: "CodyMenendez@armyspy.com",
    address: "4401 Findley Avenue Minot, ND 58701",
    rating: "4.1",
    walletBalance: "$6,325",
    joiningDate: "2019-10-05",
  },
  {
    id: 13,
    username: "Jason Merino",
    phone: "706-219-4095",
    email: "JasonMerino@dayrep.com",
    address: "3159 Holly Street Cleveland, GA 30528",
    rating: "3.8",
    walletBalance: "$4,523",
    joiningDate: "2019-10-04",
  },
];
const shops = [
  { id: 1, color: "primary", name: "Brendle's", product: 112, balance: "13,575", profileLink: "#" },
  { id: 2, color: "warning", name: "Tech Hifi", product: 104, balance: "11,145", profileLink: "#" },
  { id: 3, color: "danger", name: "Lafayette", product: 126, balance: "12,356", profileLink: "#" },
  { id: 4, color: "success", name: "Packer", product: 102, balance: "11,228", profileLink: "#" },
  { id: 5, color: "info", name: "Nedick's", product: 96, balance: "9,235", profileLink: "#" },
  { id: 6, color: "dark", name: "Hudson's", product: 120, balance: "14,794", profileLink: "#" },
  { id: 7, color: "dark", name: "Tech Hifi", product: 104, balance: "11,145", profileLink: "#" },
  { id: 8, color: "primary", name: "Brendle's", product: 112, balance: "13,575", profileLink: "#" },
  { id: 9, color: "success", name: "Lafayette", product: 120, balance: "12,356", profileLink: "#" },
];
const productComments = [
  {
    commentId: 1,
    user: {
      name: "Brian",
      profile: "avatar2",
    },
    comment:
      "If several languages coalesce, the grammar of the resulting language.",
    time: "5 hrs ago",
    hasLiked: false,
  },
  {
    commentId: 2,
    user: {
      name: "Denver",
      profile: "avatar4",
    },
    comment:
      "To an English person, it will seem like simplified English, as a skeptical Cambridge",
    time: "07 Oct, 2019",
    hasLiked: false,
    replies: [
      {
        commentId: 2,
        replyId: 1,
        user: {
          name: "Henry",
          profile: "avatar5",
        },
        comment:
          "Their separate existence is a myth. For science, music, sport, etc.",
        time: "08 Oct, 2019",
        hasLiked: false,
      },
    ],
  },
  {
    commentId: 3,
    user: {
      name: "Neal",
      profile: "avatar3",
    },
    comment: "Everyone realizes why a new common language would be desirable.",
    time: "05 Oct, 2019",
    hasLiked: false,
  },
];

const productListvar = [
  { id: 1, img: product1, name: "Half sleeve T-shirt", color: "Maroon", price: 450, data_attr: 2, total: 900 },
  { id: 2, img: product2, name: "Light blue T-shirt", color: "Light blue", price: 225, data_attr: 1, total: 225 },
  { id: 3, img: product3, name: "Black Color T-shirt", color: "Black", price: 152, data_attr: 2, total: 304 },
  { id: 4, img: product4, name: "Hoodie (Blue)", color: "Blue", price: 145, data_attr: 2, total: 290 },
  { id: 5, img: product5, name: "Half sleeve T-Shirt", color: "Light orange", price: 138, data_attr: 1, total: 138 },
  { id: 6, img: product6, name: "Green color T-shirt", color: "Green", price: 152, data_attr: 2, total: 304 },
];

export {
  productsData,
  recentProducts,
  comments,
  discountData,
  orders,
  shops,
  customerData,
  cartData,
  productComments,
  productListvar
};
