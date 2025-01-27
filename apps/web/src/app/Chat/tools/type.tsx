export type Inputs = {
  sender: string;
  message: string;
};

export type SignUpInput = {
  firstName: string;
  lastName: string;
};

export type MessageList = {
  id: string;
  sender: string;
  message: string;
  created_at: Date;
};

export type ChatList = {
  message: string;
};


export type PrivateContent = {
    id: string;
    sender: string;
    recipient: string;
    messageContent: string;
    created_at: Date;
  }
  

  export type RegisteredUsers = {
    firstName: string;
  
    lastName: string;
  }


  export type OnlineUserv2 = {
    userId: string;
    socketId: string;
     name: string;  
  }


  export type Item = {
    socketId: string;
    name: string
  }