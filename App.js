import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'


Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true
    };
  }
})



export default function App() {

  const [pushToken, setPushToken] = useState();

  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS).then(status => {
      if (status !== 'granted') {
        return Permissions.askAsync(Permissions.NOTIFICATIONS)
      }
      return statusObj;
    }).then((statusObj) => {
      if (statusObj.status !== 'granted') {
        throw new Error('Permission not granted')
      }
    }).then(() => {
      console.log('Getting token');
      return Notifications.getExpoPushTokenAsync();

    })
      .then((response) => {
        const token = response.data;
        setPushToken(token);
        console.log(token);
      })
      .catch((err) => {
        console.log(err);
        return null;
      })
  }, []);

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log(backgroundSubscription);
      })
    return () => {
      backgroundSubscription.remove();
    }

    const foregoundSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log(notification);
      });
    return () => {
      foregoundSubscription.remove();
    }
  })

  const triggerNotificationHandler = () => {
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: 'My first Local Notification',
    //     body: 'this is the first notification we are sending!',
    //   },
    //   trigger: {
    //     seconds: 10,
    //   },

    // })

    fetch('https://exp.host/--/api/v2/push/send',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: pushToken,
          data: { extraData: 'some data' },
          title: 'Sent via the app',
          body: 'This push notification was sent via the app'

        })
      }
    );

  }
  return (
    <View style={styles.container}>
      <Button
        title="triggrer Notification"
        onPress={triggerNotificationHandler}

      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
