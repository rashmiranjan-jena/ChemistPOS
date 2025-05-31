import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import classnames from "classnames";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import {
    getChats as onGetChats,
    getGroups as onGetGroups,
    getContacts as onGetContacts,
} from "/src/store/actions"

// IMage
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import Spinners from "../../components/Common/Spinner";


const ChatList = ({ userChatOpen, currentRoomId }) => {

    const dispatch = useDispatch();

    const [menu1, setMenu1] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");

    const selectProperties = createSelector(
        (state) => state.chat,
        (Chat) => ({
            chats: Chat.chats,
            groups: Chat.groups,
            contacts: Chat.contacts,
            loading: Chat.loading
        })
    );

    const { chats, groups, contacts, loading } = useSelector(selectProperties);
    const [isLoading, setLoading] = useState(loading)

    useEffect(() => {
        dispatch(onGetChats());
        dispatch(onGetGroups());
        dispatch(onGetContacts());
    }, [dispatch]);

    // eslint-disable-next-line no-unused-vars
    const currentUser = {
        name: "Henry Wells",
        isActive: true,
    };

    // change tab 
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };


    //search recent user
    const searchUsers = () => {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById("search-user");
        filter = input.value.toUpperCase();
        ul = document.getElementById("recent-list");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    };

    return (
        <React.Fragment>
            <div className="chat-leftsidebar me-lg-4">
                <div >
                    <div className="py-4 border-bottom">
                        <div className="d-flex">
                            <div className="align-self-center me-3">
                                <img src={avatar1} className="avatar-xs rounded-circle" alt="" />
                            </div>
                            <div className="flex-grow-1">
                                <h5 className="font-size-15 mt-0 mb-1"> {currentUser.name}</h5>
                                <p className="text-muted mb-0">
                                    <i className="mdi mdi-circle text-success align-middle me-2" /> Active
                                </p>
                            </div>

                            <div>
                                <Dropdown isOpen={menu1} toggle={() => setMenu1(!menu1)} className="chat-noti-dropdown active">
                                    <DropdownToggle tag="a" className="btn">
                                        <i className="bx bx-bell bx-tada"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem href="#">Action</DropdownItem>
                                        <DropdownItem href="#">Another action</DropdownItem>
                                        <DropdownItem href="#">Something else</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    <div className="search-box chat-search-box py-4">
                        <div className="position-relative">
                            <Input onKeyUp={searchUsers} id="search-user" type="text" placeholder="Search..." onChange={searchUsers} />
                            <i className="bx bx-search-alt search-icon" />
                        </div>
                    </div>

                    <div className="chat-leftsidebar-nav">
                        <Nav pills justified>
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === "chat", })} onClick={() => { toggleTab("chat"); }}>
                                    <i className="bx bx-chat font-size-20 d-sm-none" />
                                    <span className="d-none d-sm-block">Chat</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === "groups", })} onClick={() => { toggleTab("groups"); }}>
                                    <i className="bx bx-group font-size-20 d-sm-none" />
                                    <span className="d-none d-sm-block">Groups</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === "contacts", })} onClick={() => { toggleTab("contacts"); }}>
                                    <i className="bx bx-book-content font-size-20 d-sm-none" />
                                    <span className="d-none d-sm-block">Contacts</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab} className="py-4">
                            <TabPane tabId="chat">
                                <div>
                                    <h5 className="font-size-14 mb-3">Recent</h5>
                                    <ul className="list-unstyled chat-list position-relative" id="recent-list">
                                        {
                                            isLoading ? <Spinners setLoading={setLoading} /> :
                                                <SimpleBar style={{ height: "410px" }}>
                                                    {(chats || [])?.map((chat) => (
                                                        <li key={chat.id + chat.status} className={currentRoomId === chat.roomId ? "active" : ''}>
                                                            <Link to="#" onClick={() => userChatOpen(chat)}>
                                                                <div className="d-flex">
                                                                    <div className="align-self-center me-3">
                                                                        <i className={`mdi mdi-circle font-size-10 ${chat.status === "online" ? "text-success" : chat.status === "intermediate" ? "text-warning" : ""}`} />
                                                                    </div>
                                                                    {chat.isImg ? <div className="avatar-xs align-self-center me-3">
                                                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                                            {chat.profile}
                                                                        </span>
                                                                    </div>
                                                                        :
                                                                        <div className="align-self-center me-3">
                                                                            <img src={chat.image} className="rounded-circle avatar-xs" alt="" />
                                                                        </div>
                                                                    }

                                                                    <div className="flex-grow-1 overflow-hidden">
                                                                        <h5 className="text-truncate font-size-14 mb-1">
                                                                            {chat.name}
                                                                        </h5>
                                                                        <p className="text-truncate mb-0">{chat.description}</p>
                                                                    </div>
                                                                    <div className="font-size-11">{chat.time}</div>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </SimpleBar>
                                        }
                                    </ul>
                                </div>
                            </TabPane>

                            <TabPane tabId="groups">
                                <h5 className="font-size-14 mb-3">Group</h5>
                                <ul className="list-unstyled chat-list">
                                    <SimpleBar style={{ height: "410px" }}>
                                        {groups &&
                                            (groups || [])?.map((group) => (
                                                <li key={"test" + group.image} className={currentRoomId === group.roomId ? "active" : ""}>
                                                    <Link to="#" onClick={() => { userChatOpen(group) }}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="avatar-xs me-3">
                                                                <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                                    {group.image}
                                                                </span>
                                                            </div>

                                                            <div className="flex-grow-1">
                                                                <h5 className="font-size-14 mb-0">{group.name}</h5>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                    </SimpleBar>
                                </ul>
                            </TabPane>

                            <TabPane tabId="contacts">
                                <h5 className="font-size-14 mb-3">Contact</h5>
                                <div>
                                    <SimpleBar style={{ height: "410px" }}>
                                        {contacts &&
                                            (contacts || [])?.map((contact) => (
                                                <div key={"test_" + contact.category} className={contact.category === "A" ? "" : "mt-4"}>
                                                    <div className="avatar-xs mb-3">
                                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                            {contact.category}
                                                        </span>
                                                    </div>

                                                    <ul className="list-unstyled chat-list">
                                                        {(contact.child || [])?.map((array) => (
                                                            <li key={"test" + array.id} className={currentRoomId === array.roomId ? "active" : ""}>
                                                                <Link to="#" onClick={() => { userChatOpen(array) }}>
                                                                    <h5 className="font-size-14 mb-0">{array.name}</h5>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                    </SimpleBar>
                                </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ChatList;