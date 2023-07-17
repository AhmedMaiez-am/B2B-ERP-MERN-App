
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from 'react-chat-engine-advanced';

const ChatsPage = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const username = user.name;
  const secret = user.tel;
  const projectId = '090a48b1-ff5f-424e-ac5f-1dbb5654b0d3';
  const chatProps = useMultiChatLogic(projectId, username, secret);

  const chatWindowStyles = {
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1rem',
    height: '60vh',
    width: '150vh',
    margin: 'auto',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 0 30px rgba(0, 0, 255, 0.7), 0 0 20px rgba(0, 255, 0, 0.5)',
    animation: 'breathe 3s ease-in-out infinite',
  };

  return (
    <>
        <MultiChatSocket 
        projectId={chatProps.projectId}
        username={chatProps.username}
        secret={chatProps.secret}
        onConnect={chatProps.onConnect}
        onAuthFail={chatProps.onAuthFail}
        onNewChat={chatProps.onNewChat}
        onEditChat={chatProps.onEditChat}
        onDeleteChat={chatProps.onDeleteChat}
        onNewMessage={chatProps.onNewMessage}
        onEditMessage={chatProps.onEditMessage}
        onDeleteMessage={chatProps.onDeleteMessage}
        onIsTyping={chatProps.onIsTyping}
         />

        <div>
          <MultiChatWindow style={chatWindowStyles}
            chats={chatProps.chats}
            messages={chatProps.messages}
            activeChatId={chatProps.activeChatId}
            username={chatProps.username}
            peopleToInvite={chatProps.peopleToInvite}
            hasMoreChats={chatProps.hasMoreChats}
            hasMoreMessages={chatProps.hasMoreMessages}
            onChatFormSubmit={chatProps.onChatFormSubmit}
            onChatCardClick={chatProps.onChatCardClick}
            onChatLoaderShow={chatProps.onChatLoaderShow}
            onMessageLoaderShow={chatProps.onMessageLoaderShow}
            onMessageLoaderHide={chatProps.onMessageLoaderHide}
            onBottomMessageShow={chatProps.onBottomMessageShow}
            onBottomMessageHide={chatProps.onBottomMessageHide}
            onMessageFormSubmit={chatProps.onMessageFormSubmit}
            onInvitePersonClick={chatProps.onInvitePersonClick}
            onRemovePersonClick={chatProps.onRemovePersonClick}
            onDeleteChatClick={chatProps.onDeleteChatClick}
          />
        </div>
      </>
  );
};

export default ChatsPage;
