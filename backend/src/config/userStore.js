// socketId → { userId, name, color, socketId }
const onlineUsers = new Map();

export const addUser = (socketId, user) => {
  onlineUsers.set(socketId, { ...user, socketId });
};

export const removeUser = (socketId) => {
  const user = onlineUsers.get(socketId);
  onlineUsers.delete(socketId);
  return user;
};

export const getUser = (socketId) => onlineUsers.get(socketId);

export const getOnlineCount = () => onlineUsers.size;

export const getOnlineList = () =>
  Array.from(onlineUsers.values()).map(({ userId, name, color }) => ({
    userId,
    name,
    color,
  }));