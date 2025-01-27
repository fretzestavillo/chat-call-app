export type Inputs = {
  sender: string;
  message: string;
};

export type CreateMessage = {
  sender: string;
  message: string;
};

export type MessageList = {
  id: string;
  sender: string;
  message: string;
  created_at: Date;
};

export type CreatePrivateMessage = {

  sender: string;
  recipient: string;
  messageContent: string;
}


export type PrivatePeople = {
  sender: string,
  recipient: string
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