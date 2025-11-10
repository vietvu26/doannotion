import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
export async function displayLocalNotification(title: string, body: string, notionId?:string, sendToServer: boolean=true, showNotifi : boolean = false){

  const channelId = await notifee.createChannel({
    id: 'default', 
    name: 'Thong bao chung', 
    importance: AndroidImportance.HIGH,
  });
  const deepLink = notionId ? `mobilenote://notion/${notionId}` : 'mobilenote://home';

  if(showNotifi){
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        pressAction: {id: 'default', launchActivity: 'default'},
        importance: AndroidImportance.HIGH,
        style: {type: AndroidStyle.BIGTEXT, text: body}
      },
      data: {
        notionId: notionId || '',
        deepLink,
      }
    });
  }

  if(sendToServer){
    try {
      const fcmToken = await messaging().getToken();
      console.log(fcmToken);
      
      const res = await axios.post('http://198.18.63.1:3000/sendNotification',{
        token: fcmToken,
        title,
        body,
        notionId,
        deepLink,
      })
      console.log('gui len server: ', res.data);

    } catch (error) {
      console.log(error.message);
      
    }
  }
}




