/* eslint-disable prefer-const */

/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable */
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {Send} from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import React, {useEffect, useRef} from 'react';
import './Chat.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Button, Grid, Typography} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import * as API from '../../Utils/API/index';
import * as Constants from '../../Utils/Constants'
import {useParams, useHistory} from 'react-router-dom';

let chatSocket = null;
let messages = []

const Chat = () => {
  const params = useParams();
  const [ChatMessages, setChatMessages] = React.useState([{}]);
  const [RoomInfo, setRoomInfo] = React.useState([{}]);
  const divRef = useRef(null);
  const counter = 1;
  const monthNumberToLabelMap = {
    [1]: 'January',
    [2]: 'February',
    [3]: 'March',
    [4]: 'April',
    [5]: 'May',
    [6]: 'June',
    [7]: 'July',
    [8]: 'August',
    [9]: 'September',
    [10]: 'October',
    [11]: 'November',
    [12]: 'December',
  };
  let count = 0;
  let input = null
  for (let k in RoomInfo.members) if (RoomInfo.members.hasOwnProperty(k)) count++;
  
  const history = useHistory();
  const initWebSocket = () => {
    chatSocket = new WebSocket(
      'ws://127.0.0.1:8000/ws/chat/' + params.id + '/' +'?token='+localStorage.getItem('token')
    );

    chatSocket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      messages = [data.message,...messages]
      setChatMessages([...messages]);
    };
  }

  if (chatSocket == null){
    initWebSocket()
  }
 function onRoomClick(){
  history.push('/room');
 }

  useEffect(() => {  
    API.getmessages({id: params.id , page: 1})
        .then((response) => {
          setChatMessages(response.data.results);
          messages = response.data.results
        })
        .catch((error) => {
          console.log(error);
        });
    API.getroominfo({id: params.id})
        .then((response) => {
          setRoomInfo(response.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
        divRef.current.scrollIntoView();    
  }, [messages]);

  function fetchMoreData(c) {
    API.getmessages({id: params.id, page: c})
        .then((response) => {
          Chatmessages.push(response.data.results);
        })
        .catch((error) => {
          console.log(error);
        });
      }
      function addZero(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      } 
console.log(ChatMessages);
  const onSendClick = () => {
    if (chatSocket == null){
      initWebSocket()
      setTimeout(function(){ chatSocket.send(JSON.stringify({message : input})); }, 1000);
      return;
    }
    chatSocket.send(JSON.stringify({message : input}));
  }

  const onInputChange = (text) => {
    input = text
  }

  return (
    <div className="mesgs" style={{fontFamily: 'BZar'}}>
      <Grid className= "group_info">
        <Grid className="info_pic">
          <Avatar className="ch_avatar"  src={RoomInfo.room_img}/>
          
        </Grid>
        <Grid className="info">
          <Typography className="group_name"> {RoomInfo.title}</Typography>
          <Typography className="group_members">{RoomInfo.number_of_members} members</Typography>
        </Grid>
        <Grid className="back_arrow">
          <Button onClick={onRoomClick} >
          <ArrowBackIosIcon/>
          </Button>
        </Grid>
      </Grid>

      <InfiniteScroll
        dataLength={ChatMessages.length}
        next={fetchMoreData(counter + 1)}
        loader={<h4>Loading...</h4>}
      >
        <div className="msg_history">
          {ChatMessages.map((postdetail, index) => {
            const date = new Date(postdetail.created_at);
            const hour = addZero( date.getHours());
            const month = date.getMonth() + 1;
            const dt = date.getDate();
            const minute =addZero(date.getMinutes());
            return (
              <div key={index} >
                {!postdetail.is_sent_by_me ? (
                  <div class="d-flex justify-content-start mb-4 msg_card">
                    <div class="img_cont_msg">
                      <Avatar src={postdetail?.sender?.profile_img} alt="sunil" />
                    </div>
                    <div class="msg_cotainer">
                      <div className="msg_name">{postdetail?.sender?.first_name}</div>
                      <div className="content">{postdetail.content}</div>
                      <span class="msg_time"> {' ' + dt + ' ' +
                                               monthNumberToLabelMap[month] +
                                               ' ' + hour +':'+minute}
                      </span>
                    </div>
                </div>
                ) : (
                  <div class="d-flex justify-content-end mb-4 msg_card">
                    <div class="msg_cotainer_send">
                      <div className="content">{postdetail.content}</div>
                      <span class="msg_time"> {' ' + dt + ' ' +
                                               monthNumberToLabelMap[month] +
                                               ' ' + hour +':'+minute}
                      </span>
                    </div>
                </div>
                )}
                
              </div>
            );
          }).reverse()}
          <div ref={divRef} />
        </div>
      </InfiniteScroll>
        <div className="type_msg">   
            <TextareaAutosize
              id="current_message"
              className="input-text"
              rowsMin={Constants.TWEET_BOX_ROW_MIN}
              rowsMax={Constants.TWEET_BOX_ROW_MAX}
              placeholder="anything you want to say ?..."
              name="current_message"
              autoComplete="off"
              onChange={e => onInputChange(e.target.value)}
            />
          <button
          onClick={onSendClick}
          className="msg_send_btn">
            <Send />
          </button>
        </div>
        
    </div>
  );
};
export default Chat;
