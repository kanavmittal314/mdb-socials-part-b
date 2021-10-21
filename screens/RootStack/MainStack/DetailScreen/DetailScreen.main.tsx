import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { ScrollView, Image, Text, View, Share, Platform} from "react-native";
import { Appbar, Button } from "react-native-paper";
import { SocialModel } from "../../../../models/social";
import { MainStackParamList } from "../MainStackScreen";
import { styles } from "./DetailScreen.styles";
import * as Calendar from "expo-calendar";

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "DetailScreen">;
  route: RouteProp<MainStackParamList, "DetailScreen">;
}

export default function DetailScreen({ route, navigation }: Props) {
  const { social } = route.params;

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("FeedScreen")} />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  const shareSocial = (social : SocialModel) => {
    const onShare = async () => {
      try {
        const result = await Share.share({
          message: `${social.eventName} at ${social.eventLocation} on ${new Date(social.eventDate).toLocaleString()}`,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log('shared with activity');
            // shared with activity type of result.activityType
          } else {
            console.log('shared');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('dismissed');
          // dismissed
        }
      } catch (error : any) {
        alert(error.message);
      }
    };

    onShare();
  }

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Calendar.requestCalendarPermissionsAsync();
  //     if (status === 'granted') {
  //       const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  //       console.log('Here are all your calendars:');
  //       console.log({ calendars });
  //     }
  //   })();
  // }, []); 


  // async function getDefaultCalendarSource() {
  //   const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  //   const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
  //   return defaultCalendars[0].source;
  // }

  // async function createCalendar() {
  //   const defaultCalendarSource =
  //     Platform.OS === 'ios'
  //       ? await getDefaultCalendarSource()
  //       : { isLocalAccount: true, name: 'Expo Calendar' };
  //   const newCalendarID = await Calendar.createCalendarAsync({
  //     title: 'Expo Calendar',
  //     color: 'blue',
  //     entityType: Calendar.EntityTypes.EVENT,
  //     sourceId: defaultCalendarSource.id,
  //     source: defaultCalendarSource,
  //     name: 'internalCalendarName',
  //     ownerAccount: 'personal',
  //     accessLevel: Calendar.CalendarAccessLevel.OWNER,
  //   });
  //   console.log(`Your new calendar ID is: ${newCalendarID}`);
  // }


  return (
    <>
      <Bar />
      <ScrollView style={styles.container}>
        <View style={styles.view}>
          <Image style={styles.image} source={{ uri: social.eventImage }} />
          <Text style={{ ...styles.h1, marginVertical: 10 }}>
            {social.eventName}
          </Text>
          <Text style={{ ...styles.subtitle, marginBottom: 5 }}>
            {social.eventLocation}
          </Text>
          <Text style={{ ...styles.subtitle, marginTop: 5, marginBottom: 20 }}>
            {new Date(social.eventDate).toLocaleString()}
          </Text>
          <Text style={styles.body}>{social.eventDescription}</Text>
          <Button onPress={() => shareSocial(social)}>Share Social</Button>
          {/* <Button onPress={createCalendar}>Create an Event for this Social</Button> */}
        </View>
      </ScrollView>
    </>
  );
}
