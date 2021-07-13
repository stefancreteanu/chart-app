import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../hooks/useLoginStatus';
// import Button from 'react-bootstrap/esm/Button';

const ENDPOINT = 'localhost:5500';
let socket;

const Chat = ({history}) => {
    const token = window.localStorage.getItem('token');
    const {isLoggedIn} = useContext(AuthContext);
    const [username, setUsername] = useState('');

    useEffect(() => {
        socket = io(ENDPOINT, {
            auth: {
                token: `${token}`
            }
        });

        socket.on('joined_user', (userName) => {
            setUsername(userName);
        })
        
        const ac = new AbortController();

        if(!isLoggedIn) {
            history.push('/login');
        }
        return () => {
            ac.abort(); 
            socket.disconnect();

            socket.off();
        };

    }, [history, isLoggedIn, token]); 

    return (
        <div className="chat-page">
            Welcome to the chat room, {username}!
            {/* <div className="chat-container">
                {messages.map((message, index) => {
                    if(message.id === yourID) {
                        return (
                            <div className="chat-Row chat-userRow" key={index}>                 
                                <div className="chat-userMessage">
                                    <p className="chat-sender chat-senderRight">Me</p>                
                                        <div className="chat-message">
                                            {message.body}
                                        </div>
                                </div>
                            </div>
                        )
                    }
                    return (
                        <div className="chat-Row partnerRow" key={index}>
                            <div className="chat-partnerMessage">
                                <p className="chat-sender chat-senderLeft">{user.firstName}</p>
                                <div className="chat-messagePartner">
                                    {message.body}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <form className="chat-form" onSubmit={sendMessage}>
                <textarea className="chat-textarea" value={message} onChange={handleChange} placeholder="Type your message here."/>
                <Button variant="dark" className="chat-button" type="submit">Send</Button>
            </form> */}
        </div>
    )   
}

export default Chat;