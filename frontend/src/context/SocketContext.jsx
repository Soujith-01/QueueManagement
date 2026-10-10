import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { WS_URL } from '../utils/constants';
import { useAuth } from './AuthContext';
import { playSoundAlert } from '../utils/soundAlerts';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [lastQueueUpdate, setLastQueueUpdate] = useState(null);
  const [lastKitchenUpdate, setLastKitchenUpdate] = useState(null);
  const [lastInventoryUpdate, setLastInventoryUpdate] = useState(null);
  const [userNotifications, setUserNotifications] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    // Initialize STOMP over SockJS
    const socket = new SockJS(WS_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
        console.log('STOMP WebSocket Connected to Smart Canteen server');

        // Subscribe to global queue status topic
        client.subscribe('/topic/queue', (message) => {
          try {
            const data = JSON.parse(message.body);
            setLastQueueUpdate(data);
          } catch (e) {
            console.error('Failed to parse queue update message:', e);
          }
        });

        // Subscribe to kitchen updates topic
        client.subscribe('/topic/kitchen', (message) => {
          try {
            const data = JSON.parse(message.body);
            setLastKitchenUpdate(data);
            playSoundAlert('placed');
          } catch (e) {
            console.error('Failed to parse kitchen update message:', e);
          }
        });

        // Subscribe to inventory updates topic
        client.subscribe('/topic/inventory', (message) => {
          try {
            const data = JSON.parse(message.body);
            setLastInventoryUpdate(data);
          } catch (e) {
            console.error('Failed to parse inventory update message:', e);
          }
        });

        // Subscribe to logged-in user's private notification channel
        if (user?.id) {
          client.subscribe(`/topic/user/${user.id}`, (message) => {
            try {
              const notification = JSON.parse(message.body);
              setUserNotifications((prev) => [notification, ...prev]);

              if (notification.type === 'READY') {
                playSoundAlert('ready');
              } else if (notification.type === 'PREPARING' || notification.type === 'LEAVE_NOW') {
                playSoundAlert('leavenow');
              } else {
                playSoundAlert('placed');
              }
            } catch (e) {
              console.error('Failed to parse user notification:', e);
            }
          });
        }
      },
      onDisconnect: () => {
        setConnected(false);
        console.log('STOMP WebSocket Disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user?.id]);

  const subscribeToOrder = (orderId, callback) => {
    if (!stompClientRef.current || !connected) return null;
    return stompClientRef.current.subscribe(`/topic/orders/${orderId}`, (message) => {
      try {
        const order = JSON.parse(message.body);
        callback(order);
        if (order.status === 'READY') {
          playSoundAlert('ready');
        }
      } catch (e) {
        console.error('Failed to parse order topic message:', e);
      }
    });
  };

  return (
    <SocketContext.Provider
      value={{
        connected,
        lastQueueUpdate,
        lastKitchenUpdate,
        lastInventoryUpdate,
        userNotifications,
        subscribeToOrder,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
