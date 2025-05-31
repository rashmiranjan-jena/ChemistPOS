import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, InputGroup, Row, UncontrolledAlert, UncontrolledDropdown, UncontrolledTooltip } from "reactstrap";
import SimpleBar from "simplebar-react";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
    addMessage as onAddMessage,
    deleteMessage as onDeleteMessage
} from "/src/store/actions"
import Spinners from "../../components/Common/Spinner";


const UserChat = ({ Chat_Box_Username, Chat_Box_User_Status, messages, loading }) => {

    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    const [isLoading, setLoading] = useState(loading)
    const [deleteMsg, setDeleteMsg] = useState(false);
    const [copyMsgAlert, setCopyMsgAlert] = useState(false);
    const [search_Menu, setSearch_Menu] = useState(false);
    const [settings_Menu, setSettings_Menu] = useState(false);
    const [other_Menu, setOther_Menu] = useState(false);
    const [isDisable, setDisable] = useState(false);
    const [emoji, setEmoji] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [curMessage, setCurMessage] = useState("");

    //Toggle Chat Box Menus
    const toggleSearch = () => setSearch_Menu(!search_Menu);

    const toggleSettings = () => setSettings_Menu(!settings_Menu);

    const toggleOther = () => setOther_Menu(!other_Menu);

    // scroll simple bar
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.getScrollElement().scrollTop = scrollRef.current.getScrollElement().scrollHeight;
        }
    }, [messages])

    // copy msg
    const copyMsg = (ele) => {
        var copyText = ele.closest(".conversation-list").querySelector("p").innerHTML;
        navigator.clipboard.writeText(copyText);
        setCopyMsgAlert(true)
        if (copyText) {
            setTimeout(() => {
                setCopyMsgAlert(false)
            }, 1000)

        }
    };

    // delete chat
    const toggle_deleMsg = (id) => {
        setDeleteMsg(!deleteMsg);
        dispatch(onDeleteMessage(id))
    };

    // search
    const handelSearch = () => {
        const searchInput = document.getElementById("searchMessage");
        const searchFilter = searchInput.value.toUpperCase();
        const searchUL = document.getElementById("users-conversation");
        const searchLI = searchUL.getElementsByTagName("li");

        Array.prototype.forEach.call(searchLI, (search) => {
            const a = search.getElementsByTagName("p")[0] || '';
            const txtValue = a.textContent || a.innerText || '';

            if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
                search.style.display = "";
            } else {
                search.style.display = "none";
            }
        });
    };


    // emoji
    const [emojiArray, setEmojiArray] = useState([]);
    const onEmojiClick = (event, emojiObject) => {
        setEmojiArray([...emojiArray, emojiObject.emoji]);
        setCurMessage(curMessage + event.emoji);
        setDisable(true)
    };

    //  img upload
    const handleImageChange = (event) => {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            setSelectedImage(reader.result);
            setDisable(true)
        };
        reader.readAsDataURL(file);
    };


    // send msg
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const time = `${hours}: ${minutes}`
    const addMessage = () => {
        if (curMessage !== "" || selectedImage !== null) {
            const newMessage = {
                id: Math.floor(Math.random() * 100),
                to_id: 2,
                msg: curMessage,
                isSameTime: true,
                images: selectedImage,
                time: time,
            };
            dispatch(onAddMessage(newMessage));
            setCurMessage("");
            setDisable(false)
            setEmoji(false);
            setSelectedImage(null)
        }
    };

    const onKeyPress = (e) => {
        const { key, value } = e;
        if (key === "Enter") {
            setCurMessage(value);
            setDisable(true)
            addMessage();
        }
    };

    return (
        <React.Fragment>
            <div className="w-100 user-chat">
                <Card>
                    <div className="p-4 border-bottom ">
                        <Row>
                            <Col md={4} xs={9}>
                                <h5 className="font-size-15 mb-1">{Chat_Box_Username} </h5>

                                <p className="text-muted mb-0">
                                    <i
                                        className={
                                            Chat_Box_User_Status === "online"
                                                ? "mdi mdi-circle text-success align-middle me-2"
                                                : Chat_Box_User_Status === "intermediate"
                                                    ? "mdi mdi-circle text-warning align-middle me-1"
                                                    : "mdi mdi-circle align-middle me-1"
                                        }
                                    />
                                    {Chat_Box_User_Status === "online" ? "Active now" : "Offline"}
                                </p>
                            </Col>
                            <Col md={8} xs={3}>
                                <ul className="list-inline user-chat-nav text-end mb-0">
                                    <li className="list-inline-item d-none d-sm-inline-block">
                                        <Dropdown className="me-1" isOpen={search_Menu} toggle={toggleSearch}>
                                            <DropdownToggle className="btn nav-btn" tag="a">
                                                <i className="bx bx-search-alt-2" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-md">
                                                <Form className="p-3">
                                                    <FormGroup className="m-0">
                                                        <InputGroup>
                                                            <Input type="text" placeholder="Search ..." id="searchMessage" aria-label="Recipient's username" onChange={handelSearch} />
                                                            <Button color="primary" type="submit">
                                                                <i className="mdi mdi-magnify" />
                                                            </Button>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Form>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </li>
                                    <li className="list-inline-item d-none d-sm-inline-block">
                                        <Dropdown isOpen={settings_Menu} toggle={toggleSettings} className="me-1">
                                            <DropdownToggle className="btn nav-btn" tag="a">
                                                <i className="bx bx-cog" />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem href="#">View Profile</DropdownItem>
                                                <DropdownItem href="#">Clear chat</DropdownItem>
                                                <DropdownItem href="#">Muted</DropdownItem>
                                                <DropdownItem href="#">Delete</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </li>
                                    <li className="list-inline-item">
                                        <Dropdown isOpen={other_Menu} toggle={toggleOther}>
                                            <DropdownToggle className="btn nav-btn" tag="a">
                                                <i className="bx bx-dots-horizontal-rounded" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem href="#">Action</DropdownItem>
                                                <DropdownItem href="#">Another Action</DropdownItem>
                                                <DropdownItem href="#">Something else</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <div className="chat-conversation p-3">
                            <SimpleBar ref={scrollRef} style={{ height: "470px" }}>
                                {isLoading ? <Spinners setLoading={setLoading} /> :
                                    <ul className="list-unstyled" id="users-conversation">
                                        {
                                            messages && (messages || [])?.map((message, inx) => {
                                                return (
                                                    <React.Fragment key={inx}>
                                                        {
                                                            (message.userMessages || [])?.map((userMsg, index) => {
                                                                return (
                                                                    <li
                                                                        key={index}
                                                                        className={
                                                                            userMsg.to_id === 1 ? "" : "right"
                                                                        }
                                                                    >
                                                                        <div className="conversation-list">
                                                                            {/* <UncontrolledDropdown>
                                                                                <DropdownToggle href="#!" tag="a" className="dropdown-toggle">
                                                                                    <i className="bx bx-dots-vertical-rounded" />
                                                                                </DropdownToggle>
                                                                                <DropdownMenu>
                                                                                    <DropdownItem onClick={(e) => copyMsg(e.target)} href="#"> Copy</DropdownItem>
                                                                                    <DropdownItem href="#"> Save</DropdownItem>
                                                                                    <DropdownItem href="#"> Forward</DropdownItem>
                                                                                    <DropdownItem onClick={() => toggle_deleMsg(userMsg.id)} href="#"> Delete</DropdownItem>
                                                                                </DropdownMenu>
                                                                            </UncontrolledDropdown> */}
                                                                            <div className="ctext-wrap">
                                                                                <div className="conversation-name">
                                                                                    {userMsg.to_id === 1 ? message.sender : "You"}
                                                                                </div>
                                                                                <p>{userMsg.msg}</p>
                                                                                {userMsg.images && <img src={userMsg.images} alt="" width="150px" />}
                                                                                {userMsg.time !== 0 && <p className="chat-time mb-0"><i className="bx bx-time-five align-middle me-1"></i>{userMsg.time}</p>}
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </React.Fragment>)

                                            })
                                        }
                                    </ul>
                                }
                            </SimpleBar>
                        </div>
                        {
                            selectedImage &&
                            <div className="replymessage-block mb-0 d-flex align-items-start">
                                <div className="flex-grow-1">
                                    <img src={selectedImage} alt="select img" style={{ width: "150px", height: "auto" }} />
                                </div>
                                <div className="flex-shrink-0">
                                    <button type="button" id="close_toggle" className="btn btn-sm btn-link mt-n2 me-n3 fs-18" onClick={() => setSelectedImage(null)}>
                                        <i className="bx bx-x align-middle"></i>
                                    </button>
                                </div>
                            </div>
                        }

                        {copyMsgAlert && <UncontrolledAlert color='warning' role="alert">Message copied</UncontrolledAlert>}
                        {emoji && <EmojiPicker onEmojiClick={onEmojiClick} width={250} height={382} />}

                        <div className="p-3 chat-input-section">
                            <Row>
                                <Col>
                                    <div className="position-relative">
                                        <Input type="text" value={curMessage} onKeyPress={onKeyPress} onChange={e => { setCurMessage(e.target.value); setDisable(true) }} className="chat-input" placeholder="Enter Message..." />
                                        <div className="chat-input-links">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item" onClick={() => setEmoji(!emoji)}>
                                                    <Link to="#">
                                                        <i className="mdi mdi-emoticon-happy-outline me-1" id="Emojitooltip" />
                                                        <UncontrolledTooltip placement="top" target="Emojitooltip">
                                                            Emojis
                                                        </UncontrolledTooltip>
                                                    </Link>
                                                </li>
                                                <li className="list-inline-item">
                                                    <label htmlFor="imageInput" style={{ color: "#556ee6", fontSize: 16 }}>
                                                        <i className="mdi mdi-file-image-outline me-1" id="Imagetooltip" />
                                                        <UncontrolledTooltip placement="top" target="Imagetooltip">
                                                            Images
                                                        </UncontrolledTooltip>
                                                    </label>
                                                    <input type="file" id="imageInput" className="d-none" onChange={handleImageChange} />
                                                </li>
                                                <li className="list-inline-item">
                                                    <Link to="#">
                                                        <i className="mdi mdi-file-document-outline" id="Filetooltip" />
                                                        <UncontrolledTooltip placement="top" target="Filetooltip">
                                                            Add Files
                                                        </UncontrolledTooltip>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="col-auto">
                                    <Button type="button" color="primary" disabled={!isDisable} onClick={() => addMessage()} className="btn btn-primary btn-rounded chat-send w-md ">
                                        <span className="d-none d-sm-inline-block me-2"> Send</span>
                                        <i className="mdi mdi-send" />
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
            </div>
        </React.Fragment>
    );
}

export default UserChat;